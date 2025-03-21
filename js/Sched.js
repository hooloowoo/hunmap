import {toolBar} from "./util/ToolBar.js";
import {hidHandler} from "./util/HidHandler.js";
import {gui} from "./util/Gui.js";
import {hunborder} from "../data/hunborder.js";
import {railways} from "../data/railways.js";

const Sched = function () {

    this.container = document.getElementById('layout');
    this.delta=0;
    this.autoTime = true;
    this.date = 18460715;

    this.getXYLatlon = (latlon) => {
        let lat = latlon.lat+10;
        let lon = latlon.lon-19;
        let latRad = (lat) * (Math.PI)/180;
        let lonRad = (lon) * (Math.PI)/180;
        let earthRadius = 6367;
        let posX = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
        let posY = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
        return {x: posX, y: posY};
    }

    this.resize = () => {
        let vp = {width: document.body.clientWidth, height: window.innerHeight};
        this.container.style.width = '' + (vp.width) + 'px';
        this.container.style.height = '' + (vp.height) + 'px';
        this.container.style.top = '0';
        let tl = null;
        let br = null;
        railways.stations.forEach(station => {
            let p = this.getXYLatlon(station);
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

    this.repaintTimer = () => {
        if (this.autoTime) {
            let y = parseInt(this.date/10000);
            let m = parseInt((this.date % 10000)/100);
            let d = parseInt(this.date % 100);
            let now = new Date();
            if (!(y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth()) || (y === now.getFullYear() && m === now.getMonth() && d > now.getDate()))) {
                this.date += 100;
            }
            if ((this.date % 10000) > 1231) {
                this.date = parseInt(this.date/10000)*10000 + 10100 + (this.date % 100);
            }
            this.setDateControl();
            this.repaint();
        }
    }

    this.getColor = (o) => {
        let col = '#E0E0E0'
        if (o.dateTo < this.date) col = '#904040';
        else {
            if (o.dateFrom > this.date) col = '#203030';
        }
        return col;
    }

    this.paintStation = (station) => {
        let rad = 0.3;
        let col = this.getColor(station) + '80';
        if (station.dateFrom <= this.date) {
            let p = this.getXYLatlon(station);
            let mag = gui.getLayer().mag;
            gui.circle(p, mag > 10 ? rad * 15 / mag : rad, col, col);
            if (mag > 10 || station.weight !== 2) {
                let fontSize = station.weight === 2 ? 1 : 3;
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
            let rtcolor = this.getColor(route);
            let p0 = this.getXYLatlon(railways.stations.find(s => s.id === route.from));
            route.line.forEach(latlon => {
                let p1 = this.getXYLatlon(latlon);
                gui.line({p0: p0, p1: p1}, rtcolor, 2);
                p0 = p1;
            });
            let p1 = this.getXYLatlon(railways.stations.find(s => s.id === route.to));
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
        railways.routes.forEach(route => {
            let st0 = railways.stations.find(s => s.id === route.from);
            if (st0) {
                if (!st0.weight) st0.weight = 1;
                else st0.weight++;
                if (!st0.dateFrom || st0.dateFrom > route.dateFrom) st0.dateFrom = route.dateFrom;
                if (!st0.dateTo || st0.dateTo < route.dateTo) st0.dateTo = route.dateTo;
            }
            let st1 = railways.stations.find(s => s.id === route.to);
            if (st1) {
                if (!st1.weight) st1.weight = 1;
                else st1.weight++;
                if (!st1.dateFrom || st1.dateFrom > route.dateFrom) st1.dateFrom = route.dateFrom;
                if (!st1.dateTo || st1.dateTo < route.dateTo) st1.dateTo = route.dateTo;
            }
        });
    }

    this.setDateControl = () => {
        let y = '' + parseInt(this.date/10000);
        let m = '' + parseInt((this.date % 10000)/100);
        let d = '' + parseInt(this.date % 100);
        document.getElementById('date').value = y + '-' + (m.length === 1 ? '0' : '') + m + '-' + (d.length === 1 ? '0' : '') + d;
    }

    this.init = () => {
        toolBar.init(document.getElementById('tools'),()=>{});
        this.calculate();
        this.container.innerHTML='';
        gui.addDefaultLayer(this.container,this.layerId);
        window.onresize =  this.resize;
        toolBar.reset();

        toolBar.addDateFrame('date','date',(d) =>{
            this.date = parseInt(d.substring(0,4)+d.substring(5,7)+d.substring(8,10));
            this.repaint();
        });

        toolBar.toolbarButton('fit','fit',() => {
            this.resize();
            this.repaint();
        });

        toolBar.toolbarButton('yearBegin','|<',() => {
            this.date = 18460715;
            this.setDateControl();
            this.repaint();
        });
        toolBar.toolbarButton('pause','||',() => {
            this.autoTime = !this.autoTime;
            document.getElementById('yearForward').style.display = this.autoTime ? 'none' : 'inline-block';
            document.getElementById('yearBackward').style.display = this.autoTime ? 'none' : 'inline-block';
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
        this.setDateControl();
        hidHandler.register('zoom', this.onZoom);
        hidHandler.register('hoover', this.handleHoover);

        setInterval(this.repaintTimer,50);
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
