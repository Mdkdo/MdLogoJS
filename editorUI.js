document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('turtleCanvas');
    const turtleLayer = document.getElementById('turtleLayer');

    // Initialize the global turtle instance from library.js
    turtle = new Turtle(canvas, turtleLayer);

    const codeEditor = document.getElementById('codeEditor');
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtns = document.querySelectorAll('.example-btn');

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
