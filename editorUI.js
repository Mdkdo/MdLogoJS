document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('turtleCanvas');
    const turtleLayer = document.getElementById('turtleLayer');

    // Initialize the global turtle instance from library.js
    turtle = new Turtle(canvas, turtleLayer);

    const codeEditor = document.getElementById('codeEditor');
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtns = document.querySelectorAll('.example-btn');

    // Toolbar Buttons
    const newFileBtn = document.getElementById('newFileBtn');
    const openFileBtn = document.getElementById('openFileBtn');
    const saveFileBtn = document.getElementById('saveFileBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    const selectAllBtn = document.getElementById('selectAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const cutBtn = document.getElementById('cutBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const commentBtn = document.getElementById('commentBtn');
    const indentBtn = document.getElementById('indentBtn');
    const unindentBtn = document.getElementById('unindentBtn');

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // File Actions
    newFileBtn.addEventListener('click', () => {
        if (confirm('Voulez-vous créer un nouveau fichier ? Le code actuel sera perdu.')) {
            codeEditor.value = '';
            turtle.reset();
        }
    });

    openFileBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.js,.txt';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                codeEditor.value = event.target.result;
            };
            reader.readAsText(file);
        };
        input.click();
    });

    saveFileBtn.addEventListener('click', () => {
        const filename = prompt('Nom du fichier à enregistrer :', 'mon_code_logo.js');
        if (filename) {
            const blob = new Blob([codeEditor.value], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
    });

    // Settings
    settingsBtn.addEventListener('click', () => {
        const bgColor = prompt('Couleur de fond du canva (ex: white, #fff, rgb(255,255,255)) :', turtle.canvas.style.backgroundColor || 'white');
        if (bgColor !== null) {
            turtle.canvascolor(bgColor);
        }

        const turtleImgUrl = prompt('URL ou chemin de l\'image de la tortue (laisser vide pour la tortue par défaut) :');
        if (turtleImgUrl !== null) {
            turtle.setTurtleImage(turtleImgUrl);
        }
    });

    // Edit Actions
    selectAllBtn.addEventListener('click', () => {
        codeEditor.select();
        codeEditor.focus();
    });

    copyBtn.addEventListener('click', () => {
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const selectedText = codeEditor.value.substring(start, end);
        if (selectedText) {
            navigator.clipboard.writeText(selectedText);
        }
        codeEditor.focus();
    });

    cutBtn.addEventListener('click', () => {
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const text = codeEditor.value;
        const selectedText = text.substring(start, end);
        if (selectedText) {
            navigator.clipboard.writeText(selectedText);
            codeEditor.value = text.substring(0, start) + text.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start;
        }
        codeEditor.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const text = codeEditor.value;
        try {
            const clipboardText = await navigator.clipboard.readText();
            codeEditor.value = text.substring(0, start) + clipboardText + text.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start + clipboardText.length;
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
        codeEditor.focus();
    });

    commentBtn.addEventListener('click', () => {
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const text = codeEditor.value;
        const lines = text.split('\n');

        let charCount = 0;
        const newLines = lines.map(line => {
            const lineStart = charCount;
            const lineEnd = charCount + line.length;
            charCount += line.length + 1; // +1 for \n

            if (lineEnd >= start && lineStart <= end) {
                if (line.trim().startsWith('//')) {
                    return line.replace(/\/\/ ?/, '');
                } else {
                    return '// ' + line;
                }
            }
            return line;
        });
        codeEditor.value = newLines.join('\n');
        codeEditor.focus();
    });

    indentBtn.addEventListener('click', () => {
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const text = codeEditor.value;
        const lines = text.split('\n');

        let charCount = 0;
        const newLines = lines.map(line => {
            const lineStart = charCount;
            const lineEnd = charCount + line.length;
            charCount += line.length + 1;

            if (lineEnd >= start && lineStart <= end) {
                return '  ' + line;
            }
            return line;
        });
        codeEditor.value = newLines.join('\n');
        codeEditor.focus();
    });

    unindentBtn.addEventListener('click', () => {
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        const text = codeEditor.value;
        const lines = text.split('\n');

        let charCount = 0;
        const newLines = lines.map(line => {
            const lineStart = charCount;
            const lineEnd = charCount + line.length;
            charCount += line.length + 1;

            if (lineEnd >= start && lineStart <= end) {
                return line.replace(/^  ?/, '');
            }
            return line;
        });
        codeEditor.value = newLines.join('\n');
        codeEditor.focus();
    });

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
