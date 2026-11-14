JXG.Options.text.useMathJax = true;

var LIMIT = 5.5;   // max |x| or |y| for u, v, and u - v

var board = JXG.JSXGraph.initBoard('jsx_6_1_dist_fig', {
    boundingbox: [-6, 6, 6, -6],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    keepAspectRatio: true
});

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

function clampVal(t, lo, hi) {
    return Math.max(lo, Math.min(hi, t));
}

// Keep p in the box, and keep p - other (or other - p) in the box too,
// so u - v never leaves the board.
function clamp(p, other) {
    var x = clampVal(p.X(), -LIMIT, LIMIT);
    var y = clampVal(p.Y(), -LIMIT, LIMIT);
    x = clampVal(x, other.X() - LIMIT, other.X() + LIMIT);
    y = clampVal(y, other.Y() - LIMIT, other.Y() + LIMIT);
    if (x !== p.X() || y !== p.Y()) p.moveTo([x, y], 0);
}

var U = board.create('point', [4, 1], {
    name: '',
    size: 4,
    fillColor: '#0000FF',
    strokeColor: '#0000FF',
    showInfobox: false,
    snapToGrid: true,
    snapSizeX: 0.1,
    snapSizeY: 0.1
});

var V = board.create('point', [1, 3], {
    name: '',
    size: 4,
    fillColor: '#8e44ad',
    strokeColor: '#8e44ad',
    showInfobox: false,
    snapToGrid: true,
    snapSizeX: 0.1,
    snapSizeY: 0.1
});

U.on('drag', function () { clamp(U, V); });
V.on('drag', function () { clamp(V, U); });

// u - v, follows U and V
var D = board.create('point', [
    function () { return U.X() - V.X(); },
    function () { return U.Y() - V.Y(); }
], {
    name: '',
    size: 0,
    withLabel: false,
    fixed: true,
    visible: false,
    showInfobox: false
});

var vecU = board.create('arrow', [[0, 0], U], {
    strokeColor: '#0000FF',
    strokeWidth: 3,
    highlight: false
});

var vecV = board.create('arrow', [[0, 0], V], {
    strokeColor: '#8e44ad',
    strokeWidth: 3,
    highlight: false
});

var vecD = board.create('arrow', [[0, 0], D], {
    strokeColor: '#27ae60',
    strokeWidth: 2,
    highlight: false,
    fixed: true
});

// dist(u, v): double-headed dashed segment between the two tips
var distSeg = board.create('segment', [V, U], {
    strokeColor: '#c0392b',
    strokeWidth: 2,
    dash: 2,
    firstArrow: { type: 2, size: 6 },
    lastArrow: { type: 2, size: 6 },
    highlight: false,
    fixed: true
});

function fmt(n) {
    var s = (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, '');
    return s === '-0' ? '0' : s;
}

// Place a label just beyond (px, py) in the unit direction (nx, ny).
// halfW / halfH are the label's approximate half-size in board units, so a
// wide label is pushed far enough sideways not to sit on top of its vector,
// but never past the edge of the board.
function labelX(px, nx, halfW) {
    return clampVal(px + nx * (0.35 + halfW), -5.9 + halfW, 5.9 - halfW);
}
function labelY(py, ny, halfH) {
    return clampVal(py + ny * (0.35 + halfH), -5.9 + halfH, 5.9 - halfH);
}

function unitDir(x, y) {
    var r = Math.sqrt(x * x + y * y);
    return r < 1e-9 ? [0, 1] : [x / r, y / r];
}

// Normal to the segment v -> u, pointing away from the origin
function distNormal() {
    var dx = U.X() - V.X(), dy = U.Y() - V.Y();
    var n = unitDir(-dy, dx);
    var mx = (U.X() + V.X()) / 2, my = (U.Y() + V.Y()) / 2;
    if (n[0] * mx + n[1] * my < 0) n = [-n[0], -n[1]];
    return n;
}

var labelStyle = {
    fixed: true,
    highlight: false,
    fontSize: 18,
    useMathJax: true,
    parse: false,
    anchorX: 'middle',
    anchorY: 'middle'
};

var labelU = board.create('text', [
    function () { return labelX(U.X(), unitDir(U.X(), U.Y())[0], 0.2); },
    function () { return labelY(U.Y(), unitDir(U.X(), U.Y())[1], 0.25); },
    '\\(\\vec{u}\\)'
], Object.assign({}, labelStyle, { color: '#0000FF' }));

var labelV = board.create('text', [
    function () { return labelX(V.X(), unitDir(V.X(), V.Y())[0], 0.2); },
    function () { return labelY(V.Y(), unitDir(V.X(), V.Y())[1], 0.25); },
    '\\(\\vec{v}\\)'
], Object.assign({}, labelStyle, { color: '#8e44ad' }));

var labelD = board.create('text', [
    function () { return labelX(D.X(), unitDir(D.X(), D.Y())[0], 0.7); },
    function () { return labelY(D.Y(), unitDir(D.X(), D.Y())[1], 0.25); },
    '\\(\\vec{u} - \\vec{v}\\)'
], Object.assign({}, labelStyle, { color: '#27ae60' }));

var labelDist = board.create('text', [
    function () { return labelX((U.X() + V.X()) / 2, distNormal()[0], 1.1); },
    function () { return labelY((U.Y() + V.Y()) / 2, distNormal()[1], 0.25); },
    '\\(\\operatorname{dist}(\\vec{u}, \\vec{v})\\)'
], Object.assign({}, labelStyle, { color: '#c0392b' }));

// Live readout in the bottom-left corner
// var readout = board.create('text', [-5.8, -4.6, function () {
//     var a = U.X() - V.X(), b = U.Y() - V.Y();
//     var d = Math.sqrt(a * a + b * b);
//     var fa = fmt(a), fb = fmt(b);
//     if (fa.charAt(0) === '-') fa = '(' + fa + ')';
//     if (fb.charAt(0) === '-') fb = '(' + fb + ')';
//     return '\\(\\vec{u} = (' + fmt(U.X()) + ', ' + fmt(U.Y()) + '), \\ ' +
//         '\\vec{v} = (' + fmt(V.X()) + ', ' + fmt(V.Y()) + ')\\)<br>' +
//         '\\(\\operatorname{dist}(\\vec{u}, \\vec{v}) = \\|\\vec{u} - \\vec{v}\\| = ' +
//         '\\sqrt{' + fa + '^2 + ' + fb + '^2} \\approx ' + d.toFixed(2) + '\\)';
// }], {
//     fixed: true,
//     highlight: false,
//     fontSize: 15,
//     useMathJax: true,
//     parse: false,
//     color: '#333333',
//     anchorX: 'left',
//     anchorY: 'middle'
// });
