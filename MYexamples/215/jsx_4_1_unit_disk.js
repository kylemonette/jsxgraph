JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_4_1_unit_disk_fig', {
    boundingbox: [-2, 2, 2, -2],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    keepAspectRatio: true
});

var xAxis = board.create('axis', [[-2.2, 0], [2.2, 0]], {
    ticks: { visible: false, drawLabels: false, majorHeight: 0, minorHeight: 0 },
    lastArrow: { size: 6 },
    firstArrow: { size: 6 },
    strokeColor: '#333333',
    name: ''
});
var yAxis = board.create('axis', [[0, -2.2], [0, 2.2]], {
    ticks: { visible: false, drawLabels: false, majorHeight: 0, minorHeight: 0 },
    lastArrow: { size: 6 },
    firstArrow: { size: 6 },
    strokeColor: '#333333',
    name: ''
});

// Shaded unit disk
var disk = board.create('circle', [[0, 0], 1], {
    fillColor: '#EF9F27',
    fillOpacity: 0.2,
    strokeColor: '#854F0B',
    strokeWidth: 2,
    highlight: false,
    fixed: true
});

// Fixed, invisible origin shared by all three vectors
var O = board.create('point', [0, 0], {
    name: '',
    size: 0,
    withLabel: false,
    fixed: true,
    visible: false,
    showInfobox: false
});

// Keep a dragged point inside the closed unit disk
function clamp(p) {
    var x = p.X(), y = p.Y();
    var r = Math.sqrt(x * x + y * y);
    if (r > 1) p.moveTo([x / r, y / r], 0);
}

var U = board.create('point', [0.4, 0.4], {
    name: '',
    size: 3,
    fillColor: '#0000FF',
    strokeColor: '#0000FF',
    showInfobox: false,
    snapToGrid: false
});

var V = board.create('point', [-0.5, 0], {
    name: '',
    size: 3,
    fillColor: '#27ae60',
    strokeColor: '#27ae60',
    showInfobox: false,
    snapToGrid: false
});

U.on('drag', function () { clamp(U); });
V.on('drag', function () { clamp(V); });

// w = u + v, not draggable
var W = board.create('point', [
    function () { return U.X() + V.X(); },
    function () { return U.Y() + V.Y(); }
], {
    name: '',
    size: 0,
    withLabel: false,
    fixed: true,
    showInfobox: false,
    visible: false
});

var vecU = board.create('arrow', [O, U], {
    strokeColor: '#0000FF',
    strokeWidth: 2,
    highlight: false
});
var vecV = board.create('arrow', [O, V], {
    strokeColor: '#27ae60',
    strokeWidth: 2,
    highlight: false
});
var vecW = board.create('arrow', [O, W], {
    strokeColor: '#8e44ad',
    strokeWidth: 2,
    dash: 2,
    highlight: false,
    fixed: true
});

// Dashed guide edges completing the parallelogram
board.create('segment', [U, W], {
    strokeColor: '#999999', strokeWidth: 1, dash: 2, highlight: false, fixed: true
});
board.create('segment', [V, W], {
    strokeColor: '#999999', strokeWidth: 1, dash: 2, highlight: false, fixed: true
});

function label(pt, tex, color, dx, dy) {
    board.create('text', [
        function () { return pt.X() + dx * (pt.X() >= 0 ? 1 : -1); },
        function () { return pt.Y() + dy * (pt.Y() >= 0 ? 1 : -1); },
        tex
    ], {
        fixed: true,
        highlight: false,
        color: color,
        fontSize: 19,
        useMathJax: true,
        anchorX: 'middle',
        anchorY: 'middle'
    });
}
label(U, '\\(\\mathbf{u}\\)', '#0000FF', 0.12, 0.12);
label(V, '\\(\\mathbf{v}\\)', '#27ae60', 0.12, 0.12);
label(W, '\\(\\mathbf{w}=\\mathbf{u}+\\mathbf{v}\\)', '#8e44ad', 0.3, 0.15);
