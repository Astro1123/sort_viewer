class Tmp {
    constructor(ctx, tmp=null, pos={x:20, y:30}, xsize=15, ysize=8, arrsize=35) {
        this.color = "#FFFFFF";
        this.tmp = tmp;
        this.ctx = ctx;
        this.pos = pos;
        this.xsize = xsize;
        this.ysize = ysize;
        this.arrsize = arrsize;
        this.margin = 10;
        this.name = '';
    }
    
    setColor(color) {
        this.color = '#' + color;
    }
    
    setValue(value) {
        this.tmp = value;
    }
    
    setName(name) {
        this.name = name;
    }
    
    show() {
        const black = "#000";
        const {x, y} = this.pos;
        
        let shift = this.xsize * this.arrsize + this.margin;

        if (this.tmp != null) {
            this.ctx.beginPath();
            this.ctx.rect(x+shift,
                 y+this.ysize*this.arrsize+10-this.ysize*this.tmp,
                 this.xsize, this.ysize*this.tmp);
            this.ctx.strokeStyle = black;
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.ctx.fillStyle = black;
        const txt_with = this.ctx.measureText(this.name).width;
        this.ctx.fillText(this.name, x+shift-txt_with/2,
             y+this.ysize*this.arrsize+10+this.ysize*2);
    }
}

class Sep {
    constructor(ctx, ymax, len=35, max=35, pos={x:20, y:30}, xsize=15, ysize=8) {
        this.color = "#000";
        this.ctx = ctx;
        this.pos = pos;
        this.xsize = xsize;
        this.ysize = ysize;
        this.list = [];
        this.len = len;
        this.max = max;
        this.ymax = ymax;
        this.lwidth = this.ctx.lineWidth + 4;
    }
    
    add(index) {
        if (index < 0 || index > this.len) return;
        this.list.push(index);
    }
    
    setLen(len) {
        this.len = len;
    }
    
    setWidth(width) {
        this.lwidth = width;
    }
    
    setColor(color) {
        this.color = color;
    }
    
    show() {
        let line_width = this.ctx.lineWidth;
        this.ctx.lineWidth = this.lwidth;
        const {x, y} = this.pos;
        for (let i = 0; i < this.list.length; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x+this.xsize*this.list[i], y+this.ysize*this.max+10);
            this.ctx.lineTo(x+this.xsize*this.list[i], y);
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();
        }
        this.ctx.lineWidth = line_width;
    }
}

class BarViewer {
    constructor(canvas, name, arr=null, pos={x:20, y:30}, xsize=15, ysize=8) {
        if (arr != null) {
            this.arr = arr;
            this.color = new Array(this.arr.length);
            for (let i = 0; i < this.color.length; i++) {
                this.color[i] = "#FFFFFF";
            }
        } else {
            this.arr = [];
            this.color = [];
        }
        this.ctx = canvas.getContext("2d");
        this.ctx.font = "12pt sans-serif";
        this.name = name;
        this.pos = pos;
        this.xsize = xsize;
        this.ysize = ysize;
        this.max = 35;
        this.tmp = new Tmp(this.ctx);
        this.sep = new Sep(this.ctx, canvas.width);
    }
    
    setColor(index, color) {
        this.color[index] = '#' + color;
    }
    
    resetColor() {
        for (let i = 0; i < this.color.length; i++) {
            this.color[index] = '#FFFFFF';
        }
    }
    
    setValue(index, value) {
        this.arr[index] = value;
    }
    
    clear() {
        this.arr = [];
        this.color = [];
    }
    
    add(value, color = 'FFFFFF') {
        this.arr.push(value);
        this.color.push('#' + color);
    }
    
    show() {
        const black = "#000";
        const {x, y} = this.pos;
        for (let i = 0; i < this.arr.length; i++) {
            this.ctx.beginPath();
            this.ctx.rect(x+i*this.xsize, y+this.ysize*this.max+10-this.ysize*this.arr[i], this.xsize, this.ysize*this.arr[i]);
            this.ctx.strokeStyle = black
            this.ctx.fillStyle = this.color[i]
            this.ctx.fill()
            this.ctx.stroke()
        }
        this.ctx.fillStyle = black;
        const txt_with = this.ctx.measureText(this.name).width;
        this.ctx.fillText(this.name, x, y+this.ysize*this.max+10+this.ysize*2);

        this.tmp.show();
        this.sep.show();
    }
}

module.exports = BarViewer;
