JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_1_3_vec_fig', {
    boundingbox: [-4, 4, 4, -4],
    axis: false,
    grid: false,
    showCopyright: false,
    showNavigation: false,
    keepAspectRatio: true
});

// Manually build x and y axes with no tick marks
var xAxis = board.create('axis', [[-4, 0], [4, 0]], {
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

var yAxis = board.create('axis', [[0, -4], [0, 4]], {
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

// Draggable terminal point
var P = board.create('point', [1, 1], {
    name: '',
    size: 4,
    fillColor: '#0000FF',
    strokeColor: '#0000FF',
    showInfobox: false,
    snapToGrid: false
});

// Vector from origin to P
var vec = board.create('arrow', [[0, 0], P], {
    strokeColor: '#c0392b',
    strokeWidth: 2,
    highlight: false
});

// LaTeX label showing the ordered pair, fixed (not draggable), offset from P
var label = board.create('text', [
    function () { return P.X() + (P.X() >= 0 ? 0.3 : -1.6); },
    function () { return P.Y() + (P.Y() >= 0 ? 0.3 : -0.5); },
    function () {
        var x = P.X().toFixed(1).replace(/\.0$/, '');
        var y = P.Y().toFixed(1).replace(/\.0$/, '');
        return '\\(\\left(' + x + ', ' + y + '\\right)\\)';
    }
], {
    fixed: true,
    highlight: false,
    color: '#0000FF',
    fontSize: 16,
    useMathJax: true,
    anchorX: 'left',
    anchorY: 'middle'
});