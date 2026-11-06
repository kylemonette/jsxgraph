JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_7_1_vert_shift_fig', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});
var vline = board.create('line', [[0, -10], [0, 10]], {
    visible: false,
    fixed: true
});
var vertex_ptx = board.create('glider', [0, 0, vline], {
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
        return x ** 2 + vertex_ptx.Y();
    }
]);
// Format numbers cleanly, e.g. 2.0 -> 2, 2.3 -> 2.3
const fmt = function (v) {
    return parseFloat(v.toFixed(1)).toString();
};
// Format the vertical shift k
const fmtVerticalShift = function (k) {
    const kv = parseFloat(k.toFixed(1));
    if (kv === 0) {
        return '';
    }
    if (kv > 0) {
        return ` + ${fmt(kv)}`;
    }
    return ` - ${fmt(Math.abs(kv))}`;
};
// Display: f(x) = x^2 + k
var ftextval = function () {
    const k = vertex_ptx.Y();
    const kStr = fmtVerticalShift(k);
    return `\\( g(x) = x^2${kStr} \\)`;
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