JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_7_1_hor_shift_fig', {
    boundingbox: [-10, 10, 10, -3],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});

// Invisible horizontal line at y = 0 that constrains the point's motion
var hline = board.create('line', [[-10, 0], [10, 0]], {
    visible: false,
    fixed: true
});

// Glider restricted to the horizontal line -> can only move left/right
var vertex_ptx = board.create('glider', [0, 0, hline], {
    attractToGrid: true,
    attractorDistance: 10,
    attractorunit: 'screen',
    name: 'Drag me',
    color: 'red',
    size: 3
});
vertex_ptx.on('drag', () => {
    vertex_ptx.name = '';
});

var f = board.create('functiongraph', [
    function (x) {
        return (x - vertex_ptx.X()) ** 0.5;
    }
]);

// Format numbers cleanly, e.g. 2.0 -> 2, 2.3 -> 2.3
const fmt = function (v) {
    return parseFloat(v.toFixed(1)).toString();
};

// Format the horizontal shift h inside sqrt(x - h)
const fmtHorizontalShift = function (h) {
    const hv = parseFloat(h.toFixed(1));
    if (hv === 0) {
        return 'x';
    }
    if (hv > 0) {
        return `x - ${fmt(hv)}`;
    }
    return `x + ${fmt(Math.abs(hv))}`;
};

// Display: g(x) = sqrt(x - h)
var ftextval = function () {
    const h = vertex_ptx.X();
    const shiftStr = fmtHorizontalShift(h);
    return `\\( g(x) = \\sqrt{${shiftStr}} \\)`;
};

// Display text at the top
var ftext = board.create('text', [-9.2, 9.2, ftextval], {
    fontSize: 14,
    color: 'black',
    cssStyle: 'background-color: rgb(255,255,255); padding: 4px;',
    fixed: true,
    parse: false,
    useMathJax: true
});