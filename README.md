# Logo JS Interpreter

An advanced, web-based Logo interpreter that leverages modern JavaScript syntax while maintaining the charm of classic turtle graphics.

## 🚀 Features

- **JavaScript Syntax**: Use loops (`for`, `while`), functions, and standard operators.
- **Smooth Animation**: Fluid turtle movement using `requestAnimationFrame` (via `smooth(true)`).
- **Comprehensive Editor**:
  - Real-time syntax highlighting.
  - Multi-level Undo/Redo (50 states).
  - Code formatting (Indent/Outdent, Comment/Uncomment).
  - File management (New, Open, Save).
- **Dual-Layer Canvas**: Flicker-free rendering of the turtle cursor.
- **Advanced Graphics**: Support for polygons, stars, gradients, opacity, and custom turtle images.
- **Integrated Terminal**: Captured `console.log` output and error reporting with line number detection.
- **Dark Mode**: Theme-aware UI using CSS variables.
- **Rich Library**: Media support (sounds, images, videos) and degree-based math functions.

## 🛠 Implementation Details

### Architecture
The application is built with a modular approach:
- `index.html`: Main structure and UI layout.
- `style.css`: Unified styling with Dark Mode support.
- `canva.js`: The core `Turtle` class handling drawing logic and animation queues.
- `library.js`: User-facing API wrappers that bridge JS syntax to the Turtle engine.
- `syntaxe.js`: Math helpers (degree-to-radian conversions).
- `editorSyntaxe.js`: Code execution engine (`new Function`) and tokenizer-based highlighter.
- `editorUI.js`: UI event listeners, toolbar actions, and state management (Undo/Redo).
- `help.html`: Comprehensive documentation for all supported commands.

### Execution Engine
User code is wrapped in a `new Function()` constructor, injecting the library functions into the local scope. This allows native performance and full access to JS features like `Math`, `Date`, or asynchronous patterns.

### Syntax Highlighting
A layered approach is used: a transparent `textarea` for input placed exactly over a `<pre><code>` block for display. The tokenizer handles comments, strings, numbers, keywords, and specific Logo commands with a distinct color palette.

## 🔧 Improvements & Bug Fixes

### Improvements
- **Smooth Mode**: Transitioned from instant drawing to an asynchronous command queue for better visual feedback.
- **Path Management**: Improved `pd()` (pendown), `cs()` (clearscreen), and `home()` to explicitly manage canvas paths, preventing unintended lines between shapes.
- **Terminal UI**: Added a dedicated zone to distinguish between drawing and program logs/errors.
- **Undo Stack**: Implemented a robust state-saving mechanism triggered by meaningful user actions.

### Bug Fixes
- **HTML Entity Ghosting**: Fixed a bug where characters like `<` were mis-rendered in the highlighter by ensuring raw code tokenization precedes HTML escaping.
- **Dark Mode Highlights**: Resolved an issue where highlighted code lines had white backgrounds in dark mode by setting the `<code>` background to transparent.
- **Trigonometry Consistency**: Standardized all trig functions to work in degrees, matching the turtle's rotation logic and avoiding user confusion.
- **Operator Conflict**: Fixed the parser's handling of the `^` operator to correctly translate it to `**` before execution.

## 📖 How to Use

1. Open `index.html` in any modern browser.
2. Write your code in the editor (e.g., `repeat(10, () => { fd(50); rt(36); })`).
3. Click **Exécuter** (or the Play icon) to see the result.
4. Use the **?** icon to access the full command list.
