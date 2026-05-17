document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('turtleCanvas');
    const turtleLayer = document.getElementById('turtleLayer');
    const turtle = new Turtle(canvas, turtleLayer);
    const codeEditor = document.getElementById('codeEditor');
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtns = document.querySelectorAll('.example-btn');

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
    const distance = (x, y) => turtle.distance(x, y);
    const towards = (x, y) => turtle.towards(x, y);
    const ds = towards;
    const nce = distance;
    const ng = heading;

    const pencolor = (c) => turtle.pencolor(translateColor(c));
    const fillcolor = (c) => turtle.fillcolor(translateColor(c));
    const fill = (c) => turtle.fill(c);
    const canvascolor = (c) => turtle.canvascolor(c);

    // Math functions (in degrees)
    const degToRad = (d) => (d * Math.PI) / 180;
    const radToDeg = (r) => (r * 180) / Math.PI;

    const sin = (d) => Math.sin(degToRad(d));
    const cos = (d) => Math.cos(degToRad(d));
    const tan = (d) => Math.tan(degToRad(d));
    const atan = (y, x) => radToDeg(Math.atan2(y, x));
    const pi = Math.PI;
    const sqrt = Math.sqrt;
    const pow = Math.pow;
    const abs = Math.abs;
    const exp = Math.exp;
    const ln = Math.log;
    const random = (n) => Math.random() * n;
    const m = random;
    const integer = Math.floor;
    const round = Math.round;
    const ceil = Math.ceil;
    const mod = (a, b) => a % b;
    const o = mod;
    const min = Math.min;
    const max = Math.max;
    const rgb = (r, g, b) => `rgb(${r},${g},${b})`;

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

    const repeat = (n, fn) => {
        for (let i = 0; i < n; i++) {
            fn(i);
        }
    };

    const runCode = () => {
        let code = codeEditor.value;

        // Handle ^ for power (simple replacement)
        code = code.replace(/\^/g, '**');

        const helpers = {
            fd, bk, rt, lt, pu, pd, cs, clean, home, setcolor, setwidth,
            arc, circle, e, rectangle, ellipse, line, write, font,
            setxy, setheading, ht, st, posx, posy, heading, distance, towards,
            ds, nce, ng,
            pencolor, fillcolor, fill, canvascolor,
            sin, cos, tan, atan, pi, sqrt, pow, abs, exp, ln, random, m,
            integer, round, ceil, mod, o, min, max, rgb,
            playsound, showimage, showvideo,
            repeat
        };

        try {
            const keys = Object.keys(helpers);
            const values = Object.values(helpers);
            const execute = new Function(...keys, code);
            execute(...values);
        } catch (err) {
            alert('Erreur dans votre code : ' + err.message);
            console.error(err);
        }
    };

    runBtn.addEventListener('click', runCode);

    clearBtn.addEventListener('click', () => {
        turtle.reset();
    });

    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            codeEditor.value = btn.getAttribute('data-code');
            turtle.reset();
            runCode();
        });
    });

    // Initial run
    runCode();
});
