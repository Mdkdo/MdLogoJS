class Turtle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.angle = -Math.PI / 2; // Pointing up
        this.penDown = true;
        this.color = '#000000';
        this.width = 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
    }

    fd(dist) {
        const newX = this.x + dist * Math.cos(this.angle);
        const newY = this.y + dist * Math.sin(this.angle);

        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();
        }

        this.x = newX;
        this.y = newY;
    }

    bk(dist) {
        this.fd(-dist);
    }

    rt(deg) {
        this.angle += (deg * Math.PI) / 180;
    }

    lt(deg) {
        this.angle -= (deg * Math.PI) / 180;
    }

    pu() {
        this.penDown = false;
    }

    pd() {
        this.penDown = true;
    }

    cs() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.home();
    }

    home() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.angle = -Math.PI / 2;
    }

    setcolor(color) {
        this.color = color;
    }

    setwidth(width) {
        this.width = width;
    }

    // Alias for common Logo commands
    forward(dist) { this.fd(dist); }
    back(dist) { this.bk(dist); }
    right(deg) { this.rt(deg); }
    left(deg) { this.lt(deg); }
    penup() { this.pu(); }
    pendown() { this.pd(); }
    clearscreen() { this.cs(); }
}

if (typeof module !== 'undefined') {
    module.exports = Turtle;
}
