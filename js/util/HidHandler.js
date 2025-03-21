
const HidHandler = function() {

    const CLICK_DISTANCE = 20;

    let _this=this;
    this.callbacks={};
    this.lastEvents={};
    this.lastTouchMoveDelta = 0;

    this.calcLen = function(l) {
        var dx=Math.abs(l.p1.x-l.p0.x);
        var dy=Math.abs(l.p1.y-l.p0.y);
        return Math.sqrt((dx*dx)+(dy*dy));
    }

    this.register = (type,cb) => {
        if (Object.keys(this.callbacks).length === 0) {
            this.init();
       }
        if (!this.callbacks[type]) {
            let arr = this.callbacks[type];
            if (!arr) {
                arr = [];
                this.callbacks[type] = arr;
            }
        }
        this.callbacks[type].push(cb);
    }

    this.init = () => {
        hidHandler.addListener('mousemove', this.onMouseMove);
        hidHandler.addListener('mouseup', this.onMouseUp);
        hidHandler.addListener('mousedown', this.onMouseDown);
        hidHandler.addListener('wheel', this.onMouseWheel);
        hidHandler.addListener('touchstart', this.handleTouchStart);
        hidHandler.addListener('touchmove', this.handleTouchMove);
        hidHandler.addListener('touchend', this.handleTouchEnd);
    }

    this.pushEvent = (type,event) => {
        _this.lastEvents[event.type]=event;
    }

    this.addListener = (type,cb) => {
        document.getElementById('layout').addEventListener(type, function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            cb(event);
            _this.pushEvent(type,event);
        },{ passive: false });
    }

    this.delta = (e) => {
        let name = e.type;
        if (!this.lastEvents[name]) {
            e.deltaX = 0;
            e.deltaY = 0;
        } else {
            let lastEvent = this.lastEvents[name];
            let lx = lastEvent.layerX ? lastEvent.layerX : lastEvent.touches[0].clientX;
            let ly = lastEvent.layerY ? lastEvent.layerY : lastEvent.touches[0].clientY;
            let ex = e.layerX ? e.layerX : e.touches[0].clientX;
            let ey = e.layerY ? e.layerY : e.touches[0].clientY;
            e.deltaX = ex - lx;
            e.deltaY = ey - ly;
        }
    }

    this.callEvents = (type,event) => {
        if (this.callbacks[type]) {
            this.callbacks[type].forEach((cb) => {
                cb(event);
            });
        }
    }

    this.onMouseDown = (e) => {
        this.callEvents("mousedown",e);
    }

    this.onMouseUp = (e) => {
        this.callEvents("mouseup",e);
        let name = "mousedown";
        let lastEvent = this.lastEvents[name];
        let dist=this.calcLen({p0: {x:e.layerX,y:e.layerY}, p1: {x:lastEvent.layerX,y:lastEvent.layerY}});
        if (dist < CLICK_DISTANCE) {
            this.callEvents("click",e);
        }
    }

    this.onMouseMove = (e) => {
        this.callEvents("mousemove",e);
        if (e.buttons === 1) {
            this.delta(e);
            this.callEvents("hoover",e);
        }
    }

    this.onZoom = (e) => {
        this.callEvents("zoom",e);
    }

    this.onMouseWheel = (e) => {
        this.callEvents("wheel",e);
        this.onZoom(e);
    }

    this.handleTouchStart = (e) => {
        this.callEvents("touchstart",e);
    };

    this.handleTouchMove = (e) => {
        this.callEvents("touchmove",e);
        if(e.touches.length === 2) {
            let p={x:e.touches[0].clientX,y:e.touches[0].clientY};
            let pp={x:e.touches[1].clientX,y:e.touches[1].clientY};
            let dd = Math.sqrt((pp.x-p.x) * (pp.x-p.x) + (pp.y-p.y) * (pp.y-p.y));
            e.deltaX = 0;
            e.deltaY = this.lastTouchMoveDelta - dd;
            this.onZoom(e);
            this.lastTouchMoveDelta = dd;
        } else {
            this.delta(e);
            this.callEvents("hoover",e);
        }
    };

    this.handleTouchEnd = (e) => {
        this.callEvents("touchend",e);
        let name = "touchstart";
        let lastEvent = this.lastEvents[name];
        let dist=this.calcLen({p0: {x:e.layerX,y:e.layerY}, p1: {x:lastEvent.layerX,y:lastEvent.layerY}});
        if (dist < CLICK_DISTANCE) {
            this.callEvents("click",e);
        }
        this.lastEvents['touchmove'] = null;
    };

};


const hidHandler = new HidHandler();
export { hidHandler };
