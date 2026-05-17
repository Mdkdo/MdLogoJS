const runCode = () => {
    const codeEditor = document.getElementById('codeEditor');
    let code = codeEditor.value;

    // Handle ^ for power (simple replacement)
    code = code.replace(/\^/g, '**');

    const helpers = {
        fd, bk, rt, lt, pu, pd, cs, clean, home, setcolor, setwidth, ps,
        arc, circle, e, rectangle, ellipse, line, write, font,
        setxy, setheading, ht, st, posx, posy, heading, distance, towards,
        ds, nce, ng,
        pencolor, pc, fillcolor, fill, canvascolor,
        sin, cos, tan, atan, pi, sqrt, pow, abs, exp, ln, random, m,
        integer, round, ceil, mod, modulo, o, min, max, rgb,
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
