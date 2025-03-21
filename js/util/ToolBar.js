
const ToolBar = function() {

    this.container = null;
    this.toolbar = null;

    this.adiv = function(pdiv,id,cls) {
        var div=document.createElement('div');
        if (cls !== undefined) div.className=cls;
        if ((id !== null) && (id !== "")) div.id=id;
        pdiv.appendChild(div);
        return div;
    };

    this.adivhtml = function(pdiv,id,cls,ihtml) {
        var div=document.createElement('div');
        if (cls !== undefined) div.className=cls;
        if ((id !== null) && (id !== "")) div.id=id;
        pdiv.appendChild(div);
        div.innerHTML=ihtml;
        return div;
    };


    this.toolbarButton = (id,text,fn) => {
        let button = this.creat('div',id,this.toolbar,'button-link');
        this.adivhtml(button,'button-' + id,'button-text','<img alt="'+text+'" src="images/' + id + '.svg" width="24">');
        button.onclick=fn;
        return button;
    };

    this.addDateFrame = (id,title,fn) => {
        let frame=this.adiv(this.toolbar,'frame_'+id,'date-pane');
        this.adivhtml(frame,'title-frame-'+id,'id-title',title);
        let inp=document.createElement('input');
        inp.id=id;
        inp.type = 'date';
        let date = new Date();
        inp.value = date.toISOString().substring(0,10);
        inp.onchange = () => fn(inp.value);
        inp.className='toolbar';
        frame.appendChild(inp);
    }

    this.creat = function(type,id,parent,cls) {
        let ret=document.createElement(type);
        if (id) ret.id=id;
        if (cls) ret.className=cls;
        if (parent) parent.appendChild(ret);
        return ret;
    };

    this.init = (container,callback) => {
        this.container = container;
        container.innerHTML='';
        this.toolbar = this.creat('div','toolbar',this.container);
        callback();
    }

    this.reset = () => {
        this.toolbar.innerHTML='';
    }
};

const toolBar = new ToolBar();
export { toolBar };


