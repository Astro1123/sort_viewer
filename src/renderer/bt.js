const LEFT = 0
const RIGHT = 1

class Process {
    constructor(str = '') {
        this.str = str
    }
    
    clear() {
        this.str = ''
    }
    
    set(str) {
        this.str = str
    }
}

class TmpNode {
    constructor(width, value = null, color = '#000000') {
        this.value = value
        this.color = color
        this.pos = { x: width - 50, y: 20 }
        this.r = 17
        this.state = 'void'
    }
    
    clear() {
        this.state = 'void'
        this.value = null
        this.color = '#000000'
    }
    
    setValue(value, color = 'FFFFFF') {
        this.state = 'exist'
        this.value = value
        this.color = '#' + color
    }
    
    setColor(color) {
        this.color = '#' + color
    }
}

class Node {
    constructor(value, color) {
        this.value = value
        this.color = color
        this.children = []
        this.parent = null
        this.pos = { x: 0, y: 0 }
        this.r = 15
        this.state = 'heap'
    }

    get left() {
        return this.children[LEFT]
    }

    set left(value) {
        value.parent = this
        this.children[LEFT] = value
    }

    get right() {
        return this.children[RIGHT]
    }

    set right(value) {
        value.parent = this
        this.children[RIGHT] = value
    }

    set position(position) {
        this.pos = position
    }

    get position() {
        return this.pos
    }

    get radius() {
        return this.r
    }
    
    setColor(color) {
        this.color = '#' + color
    }
    
    setDefColor(color) {
        this.color = "#FFFFFF"
    }
    
    setValue(value) {
        this.value = value
    }
    
    setState(state) {
        this.state = state
        /*
        if (state == 'outer') {
            this.color = '#AAFFAA'
        } else if (state == 'void') {
            this.color = '#555555'
        }
        */
    }

}

class Tree {
    constructor(ctx, width) {
        this.width = width;
        this.ctx = ctx;
        this.ctx.font = "12pt sans-serif";
        this.root = null;
        this.startPosition = { x: width/2, y: 20 }
        this.axisX = 500
        this.axisY = 60
        this.count = 0
        this.tmp = new TmpNode(width);
        this.pro = new Process();
    }

    getPosition({ x, y }, isLeft = false) {
        const ys = this.startPosition.y;
        const cnt = (y - ys) / this.axisY + 1;
        const d = Math.pow(2, cnt)*1.5;
        return { x: isLeft ? x - this.axisX / d : x + this.axisX / d, y: y + this.axisY }
    }
    
    bit_top(cnt) {
        let bit = ~(~0 >>> 1);
        while (bit != 0) {
            if ((cnt & bit) != 0) {
                return bit;
            }
            bit = bit >>> 1;
        }
        return 0;
    }
    
    addNode(cnt, newNode) {
        let bit = this.bit_top(cnt);
        if (bit == 0) {
            return true;
        } else if (bit == 1) {
            newNode.position = this.startPosition
            this.root = newNode
            return true;
        }
        let node = this.root
        while (node) {
            bit = bit >>> 1;
            if (bit == 1) {
                if ((cnt & bit) != 0) {
                    newNode.position = this.getPosition(node.position)
                    node.right = newNode
                    break;
                } else {
                    newNode.position = this.getPosition(node.position, true)
                    node.left = newNode
                    break;
                }
            }
            if ((cnt & bit) != 0) {
                node = node.right;
            } else {
                node = node.left;
            }
        }
        return true;
    }
    
    add(value, color='FFFFFF') {
        const newNode = new Node(value, '#' + color);
        this.addNode(this.count + 1, newNode);
        this.count++;
    }

    all(node) {
        if (node === undefined)
            return
        else {
            console.log(node.value)
            this.all(node.left)
            this.all(node.right)
        }
    }

    getAll() {
        this.all(this.root)
    }
    
    showPro() {
        const black = "#000"
        const text = this.pro.str;
        const txt_with = this.ctx.measureText(text).width;
        this.ctx.beginPath();
        this.ctx.fillStyle = black;
        this.ctx.fillText(text, this.width/2 -txt_with/2, 380);
    }
    
    showTmp() {
        const black = "#000"
        if (this.tmp.state != 'void') {
            const { x, y } = this.tmp.pos;
            const color = this.tmp.color;
            this.ctx.beginPath();
            this.ctx.rect(x, y, 2 * this.tmp.r, 2 * this.tmp.r);
            this.ctx.strokeStyle = black
            this.ctx.fillStyle = color
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.fillStyle = black
            const txt_with = this.ctx.measureText(this.tmp.value).width;
            this.ctx.fillText(this.tmp.value, x+this.tmp.r-txt_with/2, y+this.tmp.r+4)
            const txt_with2 = this.ctx.measureText('tmp').width;
            this.ctx.fillText('tmp', x+this.tmp.r/2-txt_with/2, y+3*this.tmp.r)
        }
    }

    bt() {
        this.showTmp();
        this.showPro();
        const queue = [];
        const black = "#000"

        queue.push(this.root);

        while (queue.length !== 0) {
            const node = queue.shift();
            const { x, y } = node.position

            //const color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
            const color = node.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, node.radius, 0, 2 * Math.PI)
            this.ctx.strokeStyle = black
            this.ctx.fillStyle = color
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.fillStyle = black
            const txt_with = this.ctx.measureText(node.value).width;
            this.ctx.fillText(node.value, x-txt_with/2, y+4)


            node.children.forEach(child => {

                const { x: x1, y: y1 } = child.position;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + child.radius);
                if (child.state != 'outer') {
                    this.ctx.lineTo(x1, y1 - child.radius)
                }
                this.ctx.stroke();
                queue.push(child)
            });
        }
    }
    
    resetNodeColor() {
        for (let i = 0; i < this.count; i++) {
            const node = this.select(i);
            if (node.state == 'heap') {
                node.setColor('#FFFFFF');
            }
        }
    }
    
    select(index) {
        if (index == 0) {
            return this.root
        }
        let node = this.root
        let bit = this.bit_top(index+1);
        while (node) {
            bit = bit >>> 1;
            if (((index+1) & bit) != 0) {
                node = node.right;
            } else {
                node = node.left;
            }
            if (bit == 1) {
                break;
            }
        }
        return node;
    }
    
    setTmp(value, color='FFFFFF') {
        this.tmp.setValue(value, color);
    }
    
    clrTmp() {
        this.tmp.clear();
    }
    
    setTmpColor(color) {
        this.tmp.setColor(color);
    }
    
    setPro(str) {
        this.pro.set(str);
    }
    
    clrPro() {
        this.pro.clear();
    }
}

module.exports = Tree;
