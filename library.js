// Global turtle instance (will be initialized in editorUI.js)
let turtle;

// Helper functions for the user code
const fd = (n) => turtle.fd(n);
const bk = (n) => turtle.bk(n);
const rt = (n) => turtle.rt(n);
const lt = (n) => turtle.lt(n);
const pu = () => turtle.pu();
const pd = () => turtle.pd();
const cs = () => turtle.cs();
const clean = () => turtle.clean();
const home = () => turtle.home();

const colorMap = {
    'rouge': 'red', 'vert': 'green', 'bleu': 'blue', 'jaune': 'yellow',
    'noir': 'black', 'blanc': 'white', 'rose': 'pink', 'orange': 'orange',
    'violet': 'purple', 'gris': 'gray', 'marron': 'brown', 'cyan': 'cyan',
    'magenta': 'magenta'
};
const translateColor = (c) => (typeof c === 'string') ? (colorMap[c.toLowerCase()] || c) : c;

const setcolor = (c) => turtle.setcolor(translateColor(c));
const setwidth = (w) => turtle.setwidth(w);
const ps = setwidth;

const arc = (a, r) => turtle.arc(a, r);
const circle = (r) => turtle.circle(r);
const e = circle;
const rectangle = (w, h) => turtle.rectangle(w, h);
const ellipse = (w, h) => turtle.ellipse(w, h);
const line = (x1, y1, x2, y2) => turtle.line(x1, y1, x2, y2);
const write = (t) => turtle.write(t);
const font = (s) => turtle.font(s);
const setxy = (x, y) => turtle.setxy(x, y);
const setheading = (d) => turtle.setheading(d);
const ht = () => turtle.ht();
const st = () => turtle.st();
const posx = () => turtle.posx();
const posy = () => turtle.posy();
const heading = () => turtle.heading();
const ng = heading;
const distance = (x, y) => turtle.distance(x, y);
const nce = distance;
const towards = (x, y) => turtle.towards(x, y);
const ds = towards;

const pencolor = (c) => turtle.pencolor(translateColor(c));
const pc = pencolor;
const fillcolor = (c) => turtle.fillcolor(translateColor(c));
const fill = (c) => turtle.fill(c);
const canvascolor = (c) => turtle.canvascolor(translateColor(c));

const repeat = (n, fn) => {
    for (let i = 0; i < n; i++) {
        fn(i);
    }
};

// Media functions
const playsound = (url) => {
    const audio = new Audio(url);
    audio.play();
};

const showimage = (url, x, y, w, h) => {
    const img = new Image();
    img.onload = () => {
        const ix = (x !== undefined) ? x : turtle.x;
        const iy = (y !== undefined) ? y : turtle.y;
        if (w !== undefined && h !== undefined) {
            turtle.ctx.drawImage(img, ix, iy, w, h);
        } else {
            turtle.ctx.drawImage(img, ix, iy);
        }
    };
    img.src = url;
};

const showvideo = (url, x, y, w, h) => {
    const video = document.createElement('video');
    video.src = url;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.onplay = () => {
        const drawVideo = () => {
            if (video.paused || video.ended) return;
            const vx = (x !== undefined) ? x : turtle.x;
            const vy = (y !== undefined) ? y : turtle.y;
            turtle.ctx.drawImage(video, vx, vy, w || 320, h || 240);
            requestAnimationFrame(drawVideo);
        };
        drawVideo();
    };
};
