JXG.Options.text.useMathJax = true;

// Fixed basis vectors (not scalar multiples of one another)
var U1 = 2, U2 = 1;
var V1 = 1, V2 = 2;
var DET = U1 * V2 - U2 * V1;

var board = JXG.JSXGraph.initBoard('jsx_1_3_lin_com_fig', {
    boundingbox: [-6, 6, 6, -6],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    keepAspectRatio: true
});

// Manually build x and y axes with no tick marks
var xAxis = board.create('axis', [[-6, 0], [6, 0]], {
    ticks: { visible: false, drawLabels: false, majorHeight: 0, minorHeight: 0 },
    lastArrow: { size: 6 },
    firstArrow: { size: 6 },
    strokeColor: '#333333',
    name: ''
});
var yAxis = board.create('axis', [[0, -6], [0, 6]], {
    ticks: { visible: false, drawLabels: false, majorHeight: 0, minorHeight: 0 },
    lastArrow: { size: 6 },
    firstArrow: { size: 6 },
    strokeColor: '#333333',
    name: ''
});

// Draggable tip of x
var X = board.create('point', [3, 3], {
    name: '',
    size: 4,
    fillColor: '#c0392b',
    strokeColor: '#c0392b',
    showInfobox: false,
    snapToGrid: false
});

function coeffA() { return (X.X() * V2 - X.Y() * V1) / DET; }
function coeffB() { return (U1 * X.Y() - U2 * X.X()) / DET; }

// Original, unscaled u and v, shown dashed so their base direction stays visible
var vecU0 = board.create('arrow', [[0, 0], [U1, U2]], {
    strokeColor: '#2980b9',
    strokeWidth: 1.5,
    dash: 2,
    highlight: false
});

var vecV0 = board.create('arrow', [[0, 0], [V1, V2]], {
    strokeColor: '#27ae60',
    strokeWidth: 1.5,
    dash: 2,
    highlight: false
});

// Tips of the scaled u and v vectors, both anchored at the origin
var Au = board.create('point', [
    function () { return coeffA() * U1; },
    function () { return coeffA() * U2; }
], {
    name: '', size: 0, fixed: true, visible: false
});

var Bv = board.create('point', [
    function () { return coeffB() * V1; },
    function () { return coeffB() * V2; }
], {
    name: '', size: 0, fixed: true, visible: false
});

// Scaled u, drawn from the origin
var vecU = board.create('arrow', [[0, 0], Au], {
    strokeColor: '#2980b9',
    strokeWidth: 2,
    highlight: false
});

// Scaled v, drawn from the origin (scales in place, like u)
var vecV = board.create('arrow', [[0, 0], Bv], {
    strokeColor: '#27ae60',
    strokeWidth: 2,
    highlight: false
});

// x itself, from the origin to the draggable point
var vecX = board.create('arrow', [[0, 0], X], {
    strokeColor: '#c0392b',
    strokeWidth: 2,
    highlight: false
});

// Dashed guides completing the parallelogram: Au -> X and Bv -> X
var guideU = board.create('segment', [Au, X], {
    strokeColor: '#999999',
    strokeWidth: 1,
    dash: 2,
    highlight: false,
    fixed: true
});
var guideV = board.create('segment', [Bv, X], {
    strokeColor: '#999999',
    strokeWidth: 1,
    dash: 2,
    highlight: false,
    fixed: true
});

// Labels for u and v, centered at the midpoint of their (current, scaled) segments
var labelU = board.create('text', [
    function () { return Au.X() / 2 - 0.3; },
    function () { return Au.Y() / 2 + 0.3; },
    '\\(\\vec{u}\\)'
], {
    fixed: true,
    highlight: false,
    color: '#2980b9',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'middle',
    anchorY: 'middle'
});

var labelV = board.create('text', [
    function () { return Bv.X() / 2 + 0.3; },
    function () { return Bv.Y() / 2 + 0.3; },
    '\\(\\vec{v}\\)'
], {
    fixed: true,
    highlight: false,
    color: '#27ae60',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'middle',
    anchorY: 'middle'
});

// Label for x, fixed at its (draggable) tip
var labelX = board.create('text', [
    function () { return X.X() + (X.X() >= 0 ? 0.3 : -1.0); },
    function () { return X.Y() + (X.Y() >= 0 ? 0.3 : -0.35); },
    '\\(\\vec{x}\\)'
], {
    fixed: true,
    highlight: false,
    color: '#c0392b',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'left',
    anchorY: 'middle'
});

function fmt(n) {
    if (Math.abs(n) < 0.05) n = 0; // avoid a stray "-0"
    return n.toFixed(1).replace(/\.0$/, '');
}

function fmtCoeff(n) {
    var s = fmt(n);
    if (s === '1') return '';
    if (s === '-1') return '-';
    return s + '\\,';
}

// Equation banner across the top of the frame
var equation = board.create('text', [
    0,
    5.5,
    function () {
return '\\( {\\color{red} \\vec{x}} = ' + fmtCoeff(coeffA()) + '{\\color{blue} \\vec{u}} ' +
    (coeffB() < 0 ? '- ' : '+ ') + fmtCoeff(Math.abs(coeffB())) + '{\\color{green} \\vec{v}}\\)';
    }
], {
    fixed: true,
    highlight: false,
    color: '#000000',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'middle',
    anchorY: 'middle',
    cssStyle: 'background-color: white; padding: 2px 6px;'
});