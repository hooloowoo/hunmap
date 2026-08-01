import {toolBar} from "./util/ToolBar.js";
import {hidHandler} from "./util/HidHandler.js";
import {gui} from "./util/Gui.js";
import {hunborder} from "../data/hunborder.js";
import {railways} from "../data/railways.js";
import {timetables} from "../data/timetables.js";

const Sched = function () {

    this.container = document.getElementById('layout');
    this.delta=0;
    this.autoDate = true;
    this.autoTime = false;
    this.date = 18460715;
    this.time = 1200;
    this.stationById = new Map();
    this.stationPointById = new Map();
    this.projectedPointCache = new Map();

    this.getActualDate = () => {
        const now = new Date();
        return parseInt(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`, 10);
    }

    this.toMinutes = (hhmm) => {
        return (Math.trunc(hhmm / 100) * 60) + (hhmm % 100);
    }

    this.getStationById = (id) => {
        return this.stationById.get(id);
    }

    this.getXYLatlon = (latlon) => {
        const key = `${latlon.lat}|${latlon.lon}`;
        const cached = this.projectedPointCache.get(key);
        if (cached) {
            return cached;
        }
        let lat = latlon.lat+10;
        let lon = latlon.lon-19;
        let latRad = (lat) * (Math.PI)/180;
        let lonRad = (lon) * (Math.PI)/180;
        let earthRadius = 6367;
        let posX = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
        let posY = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
        const p = {x: posX, y: posY};
        this.projectedPointCache.set(key, p);
        return p;
    }

    this.resize = () => {
        let vp = {width: document.body.clientWidth, height: window.innerHeight};
        this.container.style.width = '' + (vp.width) + 'px';
        this.container.style.height = '' + (vp.height) + 'px';
        this.container.style.top = '0';
        let tl = null;
        let br = null;
        railways.stations.forEach(station => {
            let p = this.stationPointById.get(station.id) || this.getXYLatlon(station);
            if (br === null) br = {x:p.x,y:p.y};
            if (tl === null) tl = {x:p.x,y:p.y};
            if (br.x < p.x) br.x = p.x;
            if (br.y < p.y) br.y = p.y;
            if (tl.x > p.x) tl.x = p.x;
            if (tl.y > p.y) tl.y = p.y;
        });
        let dim = {topLeft: tl, bottomRight: br};
        gui.fitToViewport(dim);
        gui.onresize();
        this.repaint();
    }

    this.calcDeg = (l) => {
        let dx=l.p1.x-l.p0.x;
        let dy=l.p1.y-l.p0.y;
        if ((dx === 0) && (dy === 0)) return;
        if (dx === 0) {
            if (dy < 0) return 0;
            if (dy > 0) return 180;
        }
        if (dy === 0) {
            if (dx < 0) return 270;
            if (dx > 0) return 90;
        }
        let dd=dy/dx;
        let deg=(Math.atan(dd)*180/Math.PI);
        deg=deg+90;
        if (dx < 0) deg=180+deg;
        return deg;
    }

    this.calcLen = (l) => {
        let res=0;
        let dx=Math.abs(l.p1.x-l.p0.x);
        let dy=Math.abs(l.p1.y-l.p0.y);
        res=Math.sqrt((dx*dx)+(dy*dy));
        return res;
    }

    this.nextPoint = (p,len,deg) => {
        var dr=Math.PI/180;
        var adeg=((deg+90)%360);
        var dx=len*Math.sin(adeg*dr);
        var dy=-len*Math.cos(adeg*dr);
        return {x : p.x+dy, y: p.y-dx};
    }
/*
    this.checkDate = (cal) => {
        let dates = timetables.calendar[cal];
        return dates.some(date => date.from <= this.date && date.to >= this.date);
    }

    this.paintTrains = () => {
        timetables.lines.forEach(line => {
            if (this.checkDate(line.calendar)) {
                line.sched.forEach(sch => {
                    if (sch.timeFrom <= this.time && sch.timeTo >= this.time) {
                        let st0 = this.getStationById(sch.from);
                        let st1 = this.getStationById(sch.to);
                        if (st0 && st1) {
                            let p0 = this.stationPointById.get(st0.id);
                            let p1 = this.stationPointById.get(st1.id);
                            let l = this.calcLen({p0: p0, p1: p1});
                            let deg = this.calcDeg({p0: p0, p1: p1});

                            let fmins = this.toMinutes(sch.timeFrom);
                            let tmins = this.toMinutes(sch.timeTo);
                            let mins = this.toMinutes(this.time);

                            let len = l * (mins - fmins) / (tmins - fmins);
                            let p = this.nextPoint(p0,len,deg);
                            let col = '#FF0000';
                            gui.circle(p, 0.4, col, col);
                            gui.drawFloatText(line.nr ,
                                {p0: {x: p.x - 10, y: p.y - 5}, p1: {x: p.x + 10, y: p.y + 5}}, col, null,
                                1, 0);

                        }
                    }
                });

            }
        });
    }
*/

    this.repaintTimer = () => {
        if (this.autoDate) {
            let y = parseInt(this.date/10000);
            let m = parseInt((this.date % 10000)/100);
            let d = parseInt(this.date % 100);
            let now = new Date();
            let today = parseInt(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`, 10);
            if (this.date < today) {
                this.date += 200;
            }
            if (this.date > today) {
                this.date = today;
            }
            if ((this.date % 10000) > 1231) {
                this.date = parseInt(this.date/10000)*10000 + 10100 + (this.date % 100);
            }
            this.setDateControl();
            this.repaint();
        } else {
            if (this.autoTime) {
                this.time += 1;
                if (this.time % 100 >= 60) {
                    this.time = this.time + 40;
                }
                if (this.time >= 2400) {
                    this.time = 0;
                }
                this.setTimeControl();
                this.repaint();
            }
//            this.paintTrains();
        }
    }



    this.getRouteDate = (rts) => {
        let dt = {dateFrom: 30000101, dateTo: 30000101};
        rts.forEach(route => {
            if (route.dateFrom <= this.date) {
                dt={dateFrom: route.dateFrom, dateTo: route.dateTo};
            }
        });
        return dt;
    }

    this.getRouteColor = (o) => {
        var allRoutes = railways.routes
            .filter(route => route.from === o.from && route.to === o.to)
            .sort((a, b) => a.dateFrom - b.dateFrom);
        let dt = this.getRouteDate(allRoutes);
        let col = '#203030';
        if (dt.dateTo < this.date) col = '#904040';
        else {
            if (dt.dateFrom <= this.date) col = '#E0E0E0';
        }
        return col;
    }


    this.getStationColor = (s) => {
        var allRoutes = railways.routes
            .filter(route => route.from === s.id || route.to === s.id);
        let col = '#203030';
        allRoutes.forEach(route => {
            if (route.dateFrom <= this.date) {
                if (route.dateTo < this.date) {
                    if (col !== '#E0E0E0') 
                    col = '#904040';
                }
                else {
                    if (route.dateFrom <= this.date) col = '#E0E0E0';
                }
            }
        });

        return col;
    }

    this.getColor = (o) => {
        let col = '#E0E0E0'
        if (o.dateTo < this.date) col = '#904040';
        else {
            if (o.dateFrom >= this.date) col = '#203030';
        }
        return col;
    }

    this.paintStation = (station) => {
        let rad = 0.3;

        let col = this.getStationColor(station) ;
        if (col !== '#203030') {

            let p = this.getXYLatlon(station);
            let mag = gui.getLayer().mag;
            gui.circle(p, mag > 10 ? rad * 15 / mag : rad, col, col);
            if (mag > 10 || station.weight !== 2) {
                let fontSize = station.weight === 2 ? 1 : 2;
                gui.drawFloatText(station.name ,
                    {p0: {x: p.x - 10, y: p.y - 5}, p1: {x: p.x + 10, y: p.y + 5}}, col, null,
                    mag > 12 ? fontSize * 15 / mag : fontSize, 0);
            }
        }
    }

    this.repaint = () => {
        gui.clear();
        let lastLatlon = null;
        hunborder.latlons.forEach(latlon => {
            if (lastLatlon) {
                let p0 = this.getXYLatlon(lastLatlon);
                let p1 = this.getXYLatlon(latlon);
                gui.line({p0: p0, p1: p1}, '#604040', 2);
            }
            lastLatlon = latlon;
        });
        railways.routes.forEach(route => {

            let rtcolor = this.getRouteColor(route);
            
            let p0 = this.stationPointById.get(route.from);
            route.line.forEach(latlon => {
                let p1 = this.getXYLatlon(latlon);
                gui.line({p0: p0, p1: p1}, rtcolor, 2);
                p0 = p1;
            });
            let p1 = this.stationPointById.get(route.to);
            gui.line({p0: p0, p1: p1}, rtcolor, 2);
        });
        railways.stations.forEach(station => {
            this.paintStation(station);
        });
        gui.layer.ctx.font='20px Arial';
        gui.layer.ctx.fillStyle='#C0C0C0';
        gui.layer.ctx.fillText('Historical Map of Hungarian Railways',16,80);
    };

    this.calculate = () => {
        this.stationById.clear();
        this.stationPointById.clear();
        railways.stations.forEach(station => {
            this.stationById.set(station.id, station);
            this.stationPointById.set(station.id, this.getXYLatlon(station));
        });

        const seenRoutes = new Set();
        railways.routes.forEach(route => {
            const routeKey = `${route.from}-${route.to}`;
            if (seenRoutes.has(routeKey)) return;
            seenRoutes.add(routeKey);

            let st0 = this.getStationById(route.from);
            if (st0) {
                if (!st0.weight) st0.weight = 1;
                else st0.weight++;

            }
            let st1 = this.getStationById(route.to);
            if (st1) {
                if (!st1.weight) st1.weight = 1;
                else st1.weight++;

            }
        });
    }

    this.setDateControl = () => {
        let y = '' + parseInt(this.date/10000);
        let m = '' + parseInt((this.date % 10000)/100);
        let d = '' + parseInt(this.date % 100);
        document.getElementById('date').value = y + '-' + (m.length === 1 ? '0' : '') + m + '-' + (d.length === 1 ? '0' : '') + d;
    }

    this.setTimeControl = () => {
        let h = '' + parseInt(this.time/100);
        let m = '' + parseInt(this.time % 100);
        let s = (h.length === 1 ? '0' : '') + h + ':' + (m.length === 1 ? '0' : '') + m;
        document.getElementById('time').value = s;
    }

    this.init = () => {
        toolBar.init(document.getElementById('tools'),()=>{});
        this.calculate();
        this.container.innerHTML='';
        gui.addDefaultLayer(this.container,this.layerId);
        window.onresize =  this.resize;
        toolBar.reset();

        toolBar.toolbarButton('fit','fit',() => {
            this.resize();
            this.repaint();
        });

        toolBar.addDateFrame('date','date',(d) =>{
            this.date = parseInt(d.substring(0,4)+d.substring(5,7)+d.substring(8,10));
            this.repaint();
        });


        toolBar.toolbarButton('yearBegin','|<',() => {
            this.date = 18460715;

            this.autoDate = true;
            document.getElementById('yearForward').style.display = 'none';
            document.getElementById('yearBackward').style.display = 'none';

            this.setDateControl();
            this.repaint();
        });

        toolBar.toolbarButton('yearEnd','yearEnd',() => {
            this.date = this.getActualDate();
            this.autoDate = false;
            document.getElementById('yearForward').style.display =  'inline-block';
            document.getElementById('yearBackward').style.display =  'inline-block';

            this.setDateControl();
            this.repaint();
        });

        toolBar.toolbarButton('pause','||',() => {
            this.autoDate = !this.autoDate;
            document.getElementById('yearForward').style.display = this.autoDate ? 'none' : 'inline-block';
            document.getElementById('yearBackward').style.display = this.autoDate ? 'none' : 'inline-block';
//            document.getElementById('frame_time').style.display = this.autoDate ? 'none' : 'inline-block';
//            document.getElementById('pauseTime').style.display = this.autoDate ? 'none' : 'inline-block';
//            document.getElementById('timeBackward').style.display = this.autoDate || this.autoTime ? 'none' : 'inline-block';
//            document.getElementById('timeForward').style.display = this.autoDate || this.autoTime ? 'none' : 'inline-block';
//            document.getElementById('timeFastBackward').style.display = this.autoDate || this.autoTime ? 'none' : 'inline-block';
//            document.getElementById('timeFastForward').style.display = this.autoDate || this.autoTime ? 'none' : 'inline-block';
            this.repaint();
        });
        toolBar.toolbarButton('yearBackward','<<',() => {
            this.date = this.date - 10000;
            this.setDateControl();
            this.repaint();
        }).style.display = 'none';
        toolBar.toolbarButton('yearForward','>>',() => {
            this.date = this.date + 10000;
            this.setDateControl();
            this.repaint();
        }).style.display = 'none';


/*

        toolBar.addTimeFrame('time','time',(d) =>{
            this.time = parseInt(d.substring(0,2)+d.substring(3,5));
            this.repaint();
        }).style.display = 'none';


        toolBar.toolbarButton('pauseTime','||',() => {
            this.autoTime = !this.autoTime;
            document.getElementById('timeForward').style.display = this.autoTime ? 'none' : 'inline-block';
            document.getElementById('timeBackward').style.display = this.autoTime ? 'none' : 'inline-block';
            document.getElementById('timeFastBackward').style.display = this.autoTime ? 'none' : 'inline-block';
            document.getElementById('timeFastForward').style.display = this.autoTime ? 'none' : 'inline-block';
            this.repaint();
        }).style.display = 'none';

        toolBar.toolbarButton('timeFastBackward','<<',() => {
            this.time = this.time - 100;
            if (this.time < 0) this.time = 2400 + this.time;
            this.setTimeControl();
            this.repaint();
        }).style.display = 'none';


        toolBar.toolbarButton('timeBackward','<',() => {
            if (this.time % 100 === 0) this.time = this.time - 41;
            else this.time = this.time - 1;
            this.setTimeControl();
            this.repaint();
        }).style.display = 'none';
        toolBar.toolbarButton('timeForward','>',() => {
            this.time = this.time + 1;
            if (this.time % 100 === 60) this.time = this.time + 40;
            this.setTimeControl();
            this.repaint();
        }).style.display = 'none';
        toolBar.toolbarButton('timeFastForward','>>',() => {
            this.time = this.time + 100;
            if (this.time >= 2400) this.time = this.time - 2400;
            this.setTimeControl();
            this.repaint();
        }).style.display = 'none';

*/
        this.setDateControl();
//        this.setTimeControl();
        hidHandler.register('zoom', this.onZoom);
        hidHandler.register('hoover', this.handleHoover);

        setInterval(this.repaintTimer,100);
        this.repaintTimer();
        this.resize();
    }

    this.handleHoover = (e) => {
        let ex = e.layerX ? e.layerX : e.touches[0].clientX;
        let ey = e.layerY ? e.layerY : e.touches[0].clientY;
        let actPos = {x: ex ,y: ey };
        let lastPos = {x: ex - e.deltaX ,y: ey - e.deltaY };
        gui.moveAllByScreenPos(lastPos,actPos);
        this.repaint();
    }

    this.onZoom = (e) => {
        gui.zoomAllByScreenPos({x: e.layerX, y: e.layerY},e.deltaY < 0 ? 1.1 : 1/1.1);
        this.repaint();
    }

};

const sched = new Sched();
export { sched };
