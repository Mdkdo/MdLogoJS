document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('turtleCanvas');
    const turtle = new Turtle(canvas);
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
    const home = () => turtle.home();
    const setcolor = (c) => turtle.setcolor(c);
    const setwidth = (w) => turtle.setwidth(w);

    const repeat = (n, fn) => {
        for (let i = 0; i < n; i++) {
            fn(i);
        }
    };

    const runCode = () => {
        const code = codeEditor.value;
        try {
            // We use new Function to create a scope with our helpers
            const execute = new Function(
                'fd', 'bk', 'rt', 'lt', 'pu', 'pd', 'cs', 'home', 'setcolor', 'setwidth', 'repeat',
                code
            );
            execute(fd, bk, rt, lt, pu, pd, cs, home, setcolor, setwidth, repeat);
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
