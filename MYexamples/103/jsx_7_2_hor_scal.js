JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_7_2_hor_scal_fig', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});

var b = board.create('slider', [[2, -8], [7, -8], [-4, 1, 4]], {
    name: 'b',
    snapWidth: 0.1,
    precision: 1
});

var f = board.create('functiongraph', [
    function (x) {
        return 2 ** (b.Value() * x);
    }
]);

// Format numbers cleanly, e.g. 2.0 -> 2, 2.3 -> 2.3
const fmt = function (v) {
    return parseFloat(v.toFixed(1)).toString();
};

// Format the horizontal scaling term bx inside the exponent
const fmtHorizontalScale = function (bval) {
    const bv = parseFloat(bval.toFixed(1));
    if (bv === 1) return 'x';
    if (bv === -1) return '-x';
    return `${fmt(bv)}x`;
};

// Display: g(x) = 2^(bx)
var ftextval = function () {
    const bval = b.Value();
    const bxStr = fmtHorizontalScale(bval);
    return `\\( g(x) = 2^{${bxStr}} \\)`;
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