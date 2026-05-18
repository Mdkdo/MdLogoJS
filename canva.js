class Turtle {
    constructor(canvas, turtleLayer) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.turtleLayer = turtleLayer;
        this.turtleCtx = turtleLayer ? turtleLayer.getContext('2d') : null;
        this.reset();
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.angle = -Math.PI / 2; // Pointing up
        this.penDown = true;
        this.color = '#000000';
        this.fillColor = '#000000';
        this.width = 1;
        this.visible = true;
        this.fontName = '12px Arial';
        this.turtleImage = null;
        this.speed = 1000; // Fast by default
        this.isDrawingSmooth = false;
        this.commandQueue = [];
        this.isProcessing = false;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);

        if (this.turtleCtx) {
            this.draw();
        }
    }

    fd(dist) {
        if (this.isDrawingSmooth) {
            this.commandQueue.push({ type: 'fd', dist });
            this.processQueue();
            return;
        }
        const newX = this.x + dist * Math.cos(this.angle);
        const newY = this.y + dist * Math.sin(this.angle);

        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            this.ctx.lineCap = 'round';
            this.ctx.lineTo(newX, newY);
            this.ctx.stroke();
        } else {
            this.ctx.moveTo(newX, newY);
        }

        this.x = newX;
        this.y = newY;
        this.draw();
    }

    bk(dist) {
        this.fd(-dist);
    }

    rt(deg) {
        if (this.isDrawingSmooth) {
            this.commandQueue.push({ type: 'rt', deg });
            this.processQueue();
            return;
        }
        this.angle += (deg * Math.PI) / 180;
        this.draw();
    }

    lt(deg) {
        if (this.isDrawingSmooth) {
            this.commandQueue.push({ type: 'lt', deg });
            this.processQueue();
            return;
        }
        this.angle -= (deg * Math.PI) / 180;
        this.draw();
    }

    pu() {
        this.penDown = false;
    }

    pd() {
        this.penDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
    }

    cs() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.home();
    }

    clean() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    home() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.angle = -Math.PI / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.draw();
    }


    setwidth(width) {
        this.width = width;
    }

    arc(angle, radius) {
        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            this.ctx.beginPath();
            const startAngle = this.angle;
            const endAngle = this.angle + (angle * Math.PI) / 180;
            this.ctx.arc(this.x, this.y, radius, startAngle, endAngle, angle < 0);
            this.ctx.stroke();
        }
    }

    circle(radius) {
        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }

    rectangle(x1, y1, x2, y2) {
        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            if (x2 === undefined) {
                // If only 2 args, treat as w, h relative to turtle
                this.ctx.strokeRect(this.x, this.y, x1, y1);
            } else {
                // If 4 args, treat as absolute coords
                this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            }
        }
    }

    ellipse(x1, y1, x2, y2) {
        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            this.ctx.beginPath();
            if (x2 === undefined) {
                // Relative to turtle
                this.ctx.ellipse(this.x, this.y, x1 / 2, y1 / 2, this.angle, 0, 2 * Math.PI);
            } else {
                // Absolute bounding box
                const w = Math.abs(x2 - x1);
                const h = Math.abs(y2 - y1);
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2;
                this.ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 2 * Math.PI);
            }
            this.ctx.stroke();
        }
    }

    line(x1, y1, x2, y2) {
        if (this.penDown) {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.width;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    write(text) {
        this.ctx.font = this.fontName;
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(text, this.x, this.y);
    }

    font(style) {
        this.fontName = style;
    }

    polygon(sides, size) {
        const angle = 360 / sides;
        for (let i = 0; i < sides; i++) {
            this.fd(size);
            this.rt(angle);
        }
    }

    star(points, outerRadius, innerRadius) {
        let angle = Math.PI / points;
        this.ctx.beginPath();
        for (let i = 0; i < 2 * points; i++) {
            let r = (i % 2 === 0) ? outerRadius : innerRadius;
            let currX = this.x + r * Math.cos(this.angle + i * angle);
            let currY = this.y + r * Math.sin(this.angle + i * angle);
            if (i === 0) this.ctx.moveTo(currX, currY);
            else this.ctx.lineTo(currX, currY);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.width;
        this.ctx.stroke();
    }

    stamp() {
        this.drawOnCanvas(this.ctx);
    }

    drawOnCanvas(targetCtx) {
        targetCtx.save();
        targetCtx.translate(this.x, this.y);
        targetCtx.rotate(this.angle + Math.PI / 2);
        if (this.turtleImage) {
            const size = 30;
            targetCtx.drawImage(this.turtleImage, -size/2, -size/2, size, size);
        } else {
            targetCtx.beginPath();
            targetCtx.moveTo(0, -10);
            targetCtx.lineTo(7, 10);
            targetCtx.lineTo(-7, 10);
            targetCtx.closePath();
            targetCtx.fillStyle = 'green';
            targetCtx.fill();
            targetCtx.strokeStyle = 'black';
            targetCtx.lineWidth = 1;
            targetCtx.stroke();
        }
        targetCtx.restore();
    }

    drawImage(url, w, h) {
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, this.x - w/2, this.y - h/2, w, h);
            this.draw();
        };
        img.src = url;
    }

    gradient(type, colors) {
        let grd;
        if (type === 'linear') {
            grd = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        } else {
            grd = this.ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, 100);
        }
        colors.forEach((c, i) => grd.addColorStop(i / (colors.length - 1), c));
        this.color = grd;
    }

    opacity(value) {
        this.ctx.globalAlpha = value;
    }

    setTurtleImage(url) {
        if (!url) {
            this.turtleImage = null;
            this.draw();
            return;
        }
        const img = new Image();
        img.onload = () => {
            this.turtleImage = img;
            this.draw();
        };
        img.src = url;
    }

    setxy(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    setheading(deg) {
        this.angle = (deg - 90) * Math.PI / 180;
        this.draw();
    }

    ht() {
        this.visible = false;
        this.draw();
    }

    st() {
        this.visible = true;
        this.draw();
    }

    posx() { return this.x; }
    posy() { return this.y; }
    heading() { return (this.angle * 180 / Math.PI) + 90; }

    distance(x, y) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    }

    towards(x, y) {
        const angle = Math.atan2(y - this.y, x - this.x);
        return (angle * 180 / Math.PI) + 90;
    }

    setcolor(color) {
        this.color = color;
        this.ctx.beginPath(); // Start new path with new color
        this.ctx.moveTo(this.x, this.y);
    }

    pencolor(c) { this.setcolor(c); }
    fillcolor(c) { this.fillColor = c; }

    fill(color) {
        if (color) this.fillColor = color;
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
    }

    canvascolor(c) {
        this.canvas.style.backgroundColor = c;
    }

    draw() {
        if (!this.turtleCtx) return;

        this.turtleCtx.clearRect(0, 0, this.turtleLayer.width, this.turtleLayer.height);

        if (!this.visible) return;

        this.turtleCtx.save();
        this.turtleCtx.translate(this.x, this.y);
        this.turtleCtx.rotate(this.angle + Math.PI / 2);

        if (this.turtleImage) {
            const size = 30;
            this.turtleCtx.drawImage(this.turtleImage, -size/2, -size/2, size, size);
        } else {
            this.turtleCtx.beginPath();
            this.turtleCtx.moveTo(0, -10);
            this.turtleCtx.lineTo(7, 10);
            this.turtleCtx.lineTo(-7, 10);
            this.turtleCtx.closePath();

            this.turtleCtx.fillStyle = 'green';
            this.turtleCtx.fill();
            this.turtleCtx.strokeStyle = 'black';
            this.turtleCtx.lineWidth = 1;
            this.turtleCtx.stroke();
        }

        this.turtleCtx.restore();
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.commandQueue.length > 0) {
            const cmd = this.commandQueue.shift();
            if (cmd.type === 'fd') {
                await this.animateFd(cmd.dist);
            } else if (cmd.type === 'rt') {
                await this.animateRotate(cmd.deg);
            } else if (cmd.type === 'lt') {
                await this.animateRotate(-cmd.deg);
            }
        }

        this.isProcessing = false;
    }

    animateFd(dist) {
        return new Promise(resolve => {
            const steps = Math.max(1, Math.abs(dist) / (this.speed / 60));
            const stepX = (dist * Math.cos(this.angle)) / steps;
            const stepY = (dist * Math.sin(this.angle)) / steps;
            let currentStep = 0;

            const animate = () => {
                if (currentStep < steps) {
                    const newX = this.x + stepX;
                    const newY = this.y + stepY;
                    if (this.penDown) {
                        this.ctx.strokeStyle = this.color;
                        this.ctx.lineWidth = this.width;
                        this.ctx.lineTo(newX, newY);
                        this.ctx.stroke();
                    } else {
                        this.ctx.moveTo(newX, newY);
                    }
                    this.x = newX;
                    this.y = newY;
                    this.draw();
                    currentStep++;
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }

    animateRotate(deg) {
        return new Promise(resolve => {
            const rad = (deg * Math.PI) / 180;
            const steps = Math.max(1, Math.abs(deg) / 5);
            const stepRad = rad / steps;
            let currentStep = 0;

            const animate = () => {
                if (currentStep < steps) {
                    this.angle += stepRad;
                    this.draw();
                    currentStep++;
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }

    smooth(active) {
        this.isDrawingSmooth = active !== false;
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
