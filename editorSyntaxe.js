function updateHighlight() {
    const codeEditor = document.getElementById('codeEditor');
    const highlighting = document.getElementById('highlighting-content');
    let code = codeEditor.value;

    // Tokens definition
    const keywords = ["const", "let", "var", "if", "else", "for", "while", "function", "return", "new", "try", "catch"];
    const commands = [
        "fd", "bk", "rt", "lt", "pu", "pd", "cs", "clean", "home", "setcolor", "setwidth", "ps",
        "arc", "circle", "e", "rectangle", "ellipse", "line", "write", "font",
        "setxy", "setheading", "ht", "st", "posx", "posy", "heading", "distance", "towards",
        "ds", "nce", "ng", "pencolor", "pc", "fillcolor", "fill", "canvascolor",
        "sin", "cos", "tan", "atan", "pi", "sqrt", "pow", "abs", "exp", "ln", "random", "m",
        "integer", "round", "ceil", "mod", "modulo", "o", "min", "max", "rgb",
        "playsound", "showimage", "showvideo", "repeat"
    ];

    const combinedRegex = new RegExp(
        '(\\/\/.*|\\/\\*[\\s\\S]*?\\*\\/)|' + // Comments
        '("(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`(?:[^\\\\`]|\\\\.)*`)|' + // Strings
        '(\\b\\d+(?:\\.\\d+)?\\b)|' + // Numbers
        '(\\b(?:' + keywords.join('|') + ')\\b)|' + // Keywords
        '(\\b(?:' + commands.join('|') + ')\\b)', // Commands
        'g'
    );

    let highlighted = '';
    let lastIndex = 0;

    code.replace(combinedRegex, (match, comment, string, number, keyword, command, offset) => {
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
        } else {
            highlighted += match.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

function runCode() {
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
