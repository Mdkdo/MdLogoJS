function updateHighlight() {
    const codeEditor = document.getElementById('codeEditor');
    const highlighting = document.getElementById('highlighting-content');
    let code = codeEditor.value;

    // Tokens definition
    const keywords = ["const", "let", "var", "if", "else", "for", "while", "function", "return", "new", "try", "catch"];
    const commands = [
        "fd", "bk", "rt", "lt", "pu", "pd", "cs", "clean", "home", "setcolor", "setwidth", "ps",
        "arc", "circle", "e", "rectangle", "ellipse", "line", "write", "font",
        "polygon", "star", "stamp", "drawimage", "gradient", "opacity", "smooth",
        "setxy", "setheading", "ht", "st", "posx", "posy", "heading", "distance", "towards",
        "ds", "nce", "ng", "pencolor", "pc", "fillcolor", "fill", "canvascolor",
        "sin", "cos", "tan", "atan", "pi", "sqrt", "pow", "abs", "exp", "ln", "random", "m",
        "integer", "round", "ceil", "mod", "modulo", "o", "min", "max", "rgb",
        "playsound", "showimage", "showvideo", "repeat"
    ];

    const combinedRegex = new RegExp(
        '(\\/\/.*|\\/\\*[\\s\\S]*?\\*\\/)|' + // 1. Comments
        '("(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`(?:[^\\\\`]|\\\\.)*`)|' + // 2. Strings
        '(\\b\\d+(?:\\.\\d+)?\\b)|' + // 3. Numbers
        '(\\b(?:' + keywords.join('|') + ')\\b)|' + // 4. Keywords
        '(\\b(?:' + commands.join('|') + ')\\b)|' + // 5. Commands
        '([\\+\\-\\*/\\(\\),\\;\\[\\]\\{\\}\\.])|' + // 6. Operators
        '(\\b[a-zA-Z_$][a-zA-Z0-9_$]*\\b)', // 7. Identifiers (Unknown)
        'g'
    );

    let highlighted = '';
    let lastIndex = 0;

    code.replace(combinedRegex, (match, comment, string, number, keyword, command, operator, unknown, offset) => {
        // Add text before the match
        highlighted += code.substring(lastIndex, offset)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (comment) {
            highlighted += `<span class="hl-comment">${comment.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
        } else if (string) {
            highlighted += `<span class="hl-string">${string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
        } else if (number) {
            highlighted += `<span class="hl-number">${number}</span>`;
        } else if (keyword) {
            highlighted += `<span class="hl-keyword">${keyword}</span>`;
        } else if (command) {
            highlighted += `<span class="hl-command">${command}</span>`;
        } else if (operator) {
            highlighted += `<span class="hl-operator">${operator.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
        } else if (unknown) {
            highlighted += `<span class="hl-unknown">${unknown}</span>`;
        }

        lastIndex = offset + match.length;
        return match;
    });

    // Add remaining text
    highlighted += code.substring(lastIndex).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    highlighting.innerHTML = highlighted + (code.endsWith('\n') ? ' ' : '');
};

function syncScroll() {
    const codeEditor = document.getElementById('codeEditor');
    const highlighting = document.getElementById('highlighting');
    highlighting.scrollTop = codeEditor.scrollTop;
    highlighting.scrollLeft = codeEditor.scrollLeft;
};

function logToTerminal(msg, type = 'log') {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) return;

    const div = document.createElement('div');
    div.className = `terminal-msg terminal-${type}`;
    div.textContent = msg;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

function runCode() {
    const codeEditor = document.getElementById('codeEditor');
    let code = codeEditor.value;

    // Handle ^ for power (simple replacement)
    code = code.replace(/\^/g, '**');

    const helpers = {
        fd, bk, rt, lt, pu, pd, cs, clean, home, setcolor, setwidth, ps,
        arc, circle, e, rectangle, ellipse, line, write, font,
        polygon, star, stamp, drawimage, gradient, opacity, smooth,
        setxy, setheading, ht, st, posx, posy, heading, distance, towards,
        ds, nce, ng,
        pencolor, pc, fillcolor, fill, canvascolor,
        sin, cos, tan, atan, pi, sqrt, pow, abs, exp, ln, random, m,
        integer, round, ceil, mod, modulo, o, min, max, rgb,
        playsound, showimage, showvideo,
        repeat,
        console: {
            log: (...args) => logToTerminal(args.join(' '), 'log'),
            error: (...args) => logToTerminal(args.join(' '), 'error'),
            warn: (...args) => logToTerminal(args.join(' '), 'warn'),
            clear: () => { document.getElementById('terminalOutput').innerHTML = ''; }
        },
        print: (...args) => logToTerminal(args.join(' '), 'log')
    };

    try {
        const keys = Object.keys(helpers);
        const values = Object.values(helpers);
        // Use a wrapper to catch asynchronous errors or provide better context
        const execute = new Function(...keys, `"use strict";\n${code}`);
        execute(...values);
    } catch (err) {
        let errorMsg = err.message;

        // Try to find the line number in the stack trace
        const stack = err.stack;
        if (stack) {
            const match = stack.match(/<anonymous>:(\d+):(\d+)/);
            if (match) {
                const lineNum = parseInt(match[1]) - 1; // Subtract 1 because of "use strict"
                errorMsg = `Ligne ${lineNum}: ${errorMsg}`;
            }
        }

        logToTerminal(errorMsg, 'error');
        console.error(err);
    }
}
