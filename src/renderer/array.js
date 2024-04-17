class ArrayViewer {
    constructor(ctx, name='', arr=null, pos={x:20, y:30}, rsize=30) {
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
        this.ctx = ctx;
        this.ctx.font = "12pt sans-serif";
        this.name = name;
        this.pos = pos;
        this.size = rsize;
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
        this.ctx.fillStyle = black
        this.ctx.fillText(this.name, x+10, y-10)
        for (let i = 0; i < this.arr.length; i++) {
            this.ctx.beginPath();
            this.ctx.rect(x+i*this.size, y, this.size, this.size);
            this.ctx.strokeStyle = black
            this.ctx.fillStyle = this.color[i]
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.fillStyle = black
            const txt_with = this.ctx.measureText(this.arr[i]).width;
            this.ctx.fillText(this.arr[i], x-txt_with/2+(i+1/2)*this.size, y+this.size/2+4)
        }
    }
}

module.exports = ArrayViewer;