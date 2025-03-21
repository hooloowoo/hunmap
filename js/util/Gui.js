
const Gui = function () {

    this.layer = null;

    this.calcMiddle = function(l) {
        const dx=(l.p1.x-l.p0.x)/2;
        const dy=(l.p1.y-l.p0.y)/2;
        return {p : {x : l.p0.x+dx,y : l.p0.y+dy},dp: {x : dx, y: dy}};
    };

    this.addDefaultLayer = (cont,name) => {
        this.layer = {fldh:0.5,fldw:1,w:0,h:0,mag:1,mx:0,my:0,canvas : null,ctx : null,container : cont};
        this.reCreateCanvas(name);
    }

    this.reCreateCanvas = () => {
        if (this.layer) {
            let contentDiv=this.layer.container;
            if (this.layer.canvas) {
                contentDiv.removeChild(this.layer.canvas);
            }
            this.layer.canvas=document.createElement('canvas');
            this.layer.canvas.id='canvas';
            contentDiv.appendChild(this.layer.canvas);
            this.layer.canvas.width=this.layer.container.offsetWidth;
            this.layer.canvas.height=this.layer.container.offsetHeight;
            this.layer.ctx = this.layer.canvas.getContext("2d");
        }
    }

    this.clear = () => {
        if (this.layer && this.layer.ctx) {
            this.layer.ctx.clearRect(0,0,this.layer.canvas.width,this.layer.canvas.height);
        }
    }

    this.line = function(l,col) {
        var pp0=this.getXY(l.p0);
        var pp1=this.getXY(l.p1);
        this.layer.ctx.beginPath();
        this.layer.ctx.strokeStyle=col;
        this.layer.ctx.moveTo(pp0.x,pp0.y);
        this.layer.ctx.lineTo(pp1.x,pp1.y);
        this.layer.ctx.stroke();
    }

    this.getXY = function(p) {
        var res=this.getMagXY(p);
        return {x: res.x+this.layer.mx,y: res.y+this.layer.my};
    }

    this.getMagXY = function(p) {
        let res={x:p.x,y:p.y};
        res.x*=this.layer.mag;
        res.y*=this.layer.mag;
        return {x: ~~(res.x+.5),y: ~~(res.y+.5)};
    }

    this.getLayer = () => {
        return this.layer;
    }

    this.circle = (p,r,col,fillCol) => {
        let pp=this.getXY(p);
        let rp=r*this.layer.mag;
        this.layer.ctx.beginPath();
        this.layer.ctx.strokeStyle=col;
        this.layer.ctx.fillStyle=fillCol ? fillCol : col;
        this.layer.ctx.arc(pp.x,pp.y,rp,0,2*Math.PI,false);
        this.layer.ctx.stroke();
        this.layer.ctx.fill();
    }

    this.drawFloatText = function(txt,l,col,bcol,size,pmarg,borderColor) {
        let marg=(pmarg === undefined ? 10 : pmarg);
        this.layer.ctx.font=''+(size*this.layer.mag)+'px Arial';
        let mt=this.layer.ctx.measureText(txt);

        let tdim={w:mt.width,h:size*this.layer.mag};
        let pm=this.calcMiddle(l).p;
        let w2=tdim.w/2;
        let h2=tdim.h/2;
        let p0={x:pm.x,y:pm.y};
        let gp0=this.getXY(p0);
        let gp = {x:gp0.x - w2,y:gp0.y - tdim.h};
        let gmarg=marg*this.layer.mag;
        gp.y-=h2;
        let x = gp.x-gmarg;
        let y = gp.y-gmarg;
        let w = tdim.w+(gmarg*2);
        let h = tdim.h+(gmarg*2);
        let rect = {p0:{x:x,y:y},p1:{x:x+w,y:y+h},w:w,h:h}
        if (bcol !== null) {
            this.layer.ctx.beginPath();
            this.layer.ctx.rect(x,y ,w,h);
            this.layer.ctx.fillStyle=bcol;
            this. layer.ctx.fill();
        }
        if (borderColor) {
            this.layer.ctx.beginPath();
            this.layer.ctx.rect(x,y ,w,h);
            this.layer.ctx.strokeStyle=borderColor;
            this.layer.ctx.stroke();
        }
        gp.y+=tdim.h;
        this.layer.ctx.fillStyle=col;
        this.layer.ctx.fillText(txt,gp.x,gp.y);
        return rect;
    }


    this.onresize = function() {
        this.reCreateCanvas();
        this.clear();
    }

    this.zoomAllByScreenPos = (sp,m) => {
        let rp = this.getInvXY(sp);
        this.layer.mag *= m;
        let spn = this.getXY(rp);
        this.moveAllByScreenPos(spn,sp);
    }

    this.getInvXY = function(p) {
        let tx=(p.x-this.layer.mx);
        let ty=(p.y-this.layer.my);
        tx/=this.layer.mag;
        ty/=this.layer.mag;
        let x=tx;
        let y=ty;
        return {x: Math.round(x),y: Math.round(y)};
    }

    this.moveAllByScreenPos = (lastPos,actPos) => {
        let p = {x:actPos.x-lastPos.x,y:actPos.y-lastPos.y};
        this.layer.mx+=p.x;
        this.layer.my+=p.y;
    }

    this.fitToViewport = function(dims) {
        this.layer.w=this.layer.canvas.offsetWidth;
        this.layer.h=this.layer.canvas.offsetHeight;
        let dw=(dims.bottomRight.x-dims.topLeft.x);
        let dh=(dims.bottomRight.y-dims.topLeft.y);
        let margin = 20;
        let ratio = dw/dh;
        let layerRatio = this.layer.w/this.layer.h;
        if (layerRatio > ratio) {
            this.layer.mag = this.layer.h/(dh+margin);
        } else {
            this.layer.mag = this.layer.w/(dw+margin);
        }
        this.layer.mx=(-dims.topLeft.x*this.layer.mag + (this.layer.w-dw*this.layer.mag)/2);
        this.layer.my=(-dims.topLeft.y*this.layer.mag + (this.layer.h-dh*this.layer.mag)/2);
        return this.layer;
    }

};

const gui = new Gui();
export { gui };


