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
