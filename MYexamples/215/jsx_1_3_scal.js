JXG.Options.text.useMathJax = true;

var X1 = 1, X2 = -2;            // fixed vector x
var LEN2 = X1 * X1 + X2 * X2;   // |x|^2, used for projecting the drag onto x's line
var K_MIN = -2, K_MAX = 3, K_STEP = 0.5;

var board = JXG.JSXGraph.initBoard('jsx_1_3_scal_fig', {
    boundingbox: [-3.5, 5, 4.5, -7.5],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    keepAspectRatio: true
});

// Manually build x and y axes with no tick marks
var xAxis = board.create('axis', [[-3.5, 0], [4.5, 0]], {
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
var yAxis = board.create('axis', [[0, -7.5], [0, 5]], {
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

// Static vector x, always in black
var Xpt = board.create('point', [X1, X2], {
    name: '',
    fixed: true,
    visible: false
});

var vecX = board.create('arrow', [[0, 0], Xpt], {
    strokeColor: '#000000',
    strokeWidth: 2,
    highlight: false
});

var labelX = board.create('text', [X1 + 0.25, X2 - 0.25, '\\(\\vec{x}\\)'], {
    fixed: true,
    highlight: false,
    color: '#000000',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'left',
    anchorY: 'middle'
});

// Draggable scaled vector, starts at k = 1.5
var startK = 2;
var P = board.create('point', [startK * X1, startK * X2], {
    name: '',
    size: 4,
    fillColor: '#c0392b',
    strokeColor: '#c0392b',
    showInfobox: false,
    snapToGrid: false
});

function currentK() {
    return (P.X() * X1 + P.Y() * X2) / LEN2;
}

P.on('drag', function () {
    var k = currentK();
    k = Math.round(k / K_STEP) * K_STEP;
    if (k < K_MIN) k = K_MIN;
    if (k > K_MAX) k = K_MAX;
    P.moveTo([k * X1, k * X2], 0);
});

var vecScaled = board.create('arrow', [[0, 0], P], {
    strokeColor: '#c0392b',
    strokeWidth: 2,
    highlight: false
});

// Format k (a multiple of 0.5) as an integer or a reduced fraction over 2
function fmtK(k) {
    var n = Math.round(k * 2); // k is always a multiple of 0.5, so n is an integer
    if (n % 2 === 0) {
        return (n / 2).toString();
    }
    var sign = n < 0 ? '-' : '';
    n = Math.abs(n);
    return sign + '\\frac{' + n + '}{2}';
}

// LaTeX label showing k, fixed (not draggable), offset from the tip
var labelK = board.create('text', [
    function () { return P.X() + (P.X() >= 0 ? 0.3 : -1.2); },
    function () { return P.Y() + (P.Y() >= 0 ? 0.35 : -0.35); },
    function () { return '\\(' + fmtK(currentK()) + ' \\vec{x} \\)'; }
], {
    fixed: true,
    highlight: false,
    color: '#c0392b',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'left',
    anchorY: 'middle'
});