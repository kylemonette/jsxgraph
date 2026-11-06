JXG.Options.text.useMathJax = true;

var LIMIT = 4.5;   // max x or y a terminal point (or the sum) may reach
var MIN = -0.5;      // keep points off the axes so vectors stay visible

var board = JXG.JSXGraph.initBoard('jsx_1_3_par_fig', {
    boundingbox: [-1.5, 6, 5, -1.5],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    keepAspectRatio: true
});

// Manually build x and y axes with no tick marks
var xAxis = board.create('axis', [[-0.8, 0], [4.6, 0]], {
    ticks: {
        visible: false,
        drawLabels: false,
        majorHeight: 0,
        minorHeight: 0
    },
    lastArrow: { size: 6 },
    firstArrow: { size: 6 },
    strokeColor: '#333333',
    name: ''
});
var yAxis = board.create('axis', [[0, -0.8], [0, 4.6]], {
    ticks: {
        visible: false,
        drawLabels: false,
        majorHeight: 0,
        minorHeight: 0
    },
    lastArrow: { size: 6 },
    firstArrow: { size: 6 },
    strokeColor: '#333333',
    name: ''
});

// Clamp a terminal point to quadrant 1, keeping the point AND the vector sum
// inside the bounding box.
function clamp(p, other) {
    var x = p.X(), y = p.Y();

    if (x < MIN) x = MIN;
    if (y < MIN) y = MIN;
    if (x > LIMIT) x = LIMIT;
    if (y > LIMIT) y = LIMIT;
    if (x + other.X() > LIMIT) x = LIMIT - other.X();
    if (y + other.Y() > LIMIT) y = LIMIT - other.Y();
    if (x < MIN) x = MIN;
    if (y < MIN) y = MIN;
    p.moveTo([x, y], 0);
}

// Terminal points for the two vectors
var A = board.create('point', [3, 1], {
    name: '',
    size: 4,
    fillColor: '#0000FF',
    strokeColor: '#0000FF',
    showInfobox: false,
    snapToGrid: false
});

var B = board.create('point', [1, 2.5], {
    name: '',
    size: 4,
    fillColor: '#27ae60',
    strokeColor: '#27ae60',
    showInfobox: false,
    snapToGrid: false
});

A.on('drag', function () { clamp(A, B); });
B.on('drag', function () { clamp(B, A); });

// Sum point (parallelogram's far corner), follows A and B automatically
var S = board.create('point', [
    function () { return A.X() + B.X(); },
    function () { return A.Y() + B.Y(); }
], {
    name: '',
    size: 0,
    withLabel: false,
    fixed: true,
    showInfobox: false,
    visible: false
});

// Lightly shaded parallelogram O, A, S, B
var parallelogram = board.create('polygon', [[0, 0], A, S, B], {
    fillColor: '#8e44ad',
    fillOpacity: 0.15,
    borders: { visible: false },
    vertices: { visible: false },
    highlight: false
});

// The two vectors
var vecA = board.create('arrow', [[0, 0], A], {
    strokeColor: '#0000FF',
    strokeWidth: 2,
    highlight: false
});

var vecB = board.create('arrow', [[0, 0], B], {
    strokeColor: '#27ae60',
    strokeWidth: 2,
    highlight: false
});

// Sum vector
var vecSum = board.create('arrow', [[0, 0], S], {
    strokeColor: '#8e44ad',
    strokeWidth: 2,
    dash: 2,
    highlight: false
});

// Dashed guide edges completing the parallelogram (A to S, B to S)
var guideA = board.create('segment', [A, S], {
    strokeColor: '#999999',
    strokeWidth: 1,
    dash: 2,
    highlight: false,
    fixed: true
});
var guideB = board.create('segment', [B, S], {
    strokeColor: '#999999',
    strokeWidth: 1,
    dash: 2,
    highlight: false,
    fixed: true
});

function fmt(n) {
    return n.toFixed(1).replace(/\.0$/, '');
}

// LaTeX labels for A, B, and the sum, fixed (not draggable)
var labelA = board.create('text', [
    function () { return A.X() + 0.25; },
    function () { return A.Y() + 0.25; },
    function () { return '\\( \\vec{v} = \\left(' + fmt(A.X()) + ', ' + fmt(A.Y()) + '\\right)\\)'; }
], {
    fixed: true,
    highlight: false,
    color: '#0000FF',
    fontSize: 15,
    useMathJax: true,
    anchorX: 'left',
    anchorY: 'middle'
});

var labelB = board.create('text', [
    function () { return B.X() + 0.25; },
    function () { return B.Y() + 0.25; },
    function () { return '\\( \\vec{u}=\\left(' + fmt(B.X()) + ', ' + fmt(B.Y()) + '\\right)\\)'; }
], {
    fixed: true,
    highlight: false,
    color: '#27ae60',
    fontSize: 15,
    useMathJax: true,
    anchorX: 'right',
    anchorY: 'middle'
});

var labelS = board.create('text', [
    function () { return S.X() + 0.15; },
    function () { return S.Y() + 0.15; },
    function () { return '\\( \\vec{u} + \\vec{v} = \\left(' + fmt(S.X()) + ', ' + fmt(S.Y()) + '\\right)\\)'; }
], {
    fixed: true,
    highlight: false,
    color: '#8e44ad',
    fontSize: 15,
    useMathJax: true,
    anchorX: 'middle',
    anchorY: 'middle'
});