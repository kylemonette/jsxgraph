JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_7_2_vert_scal_fig', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});

var a = board.create('slider', [[2, -6], [7, -6], [-4, 1, 4]], {
    name: 'a',
    snapWidth: 0.1,
    precision: 1
});

var f = board.create('functiongraph', [
    function (x) {
        return a.Value() * x ** 3;
    }
]);

// Format numbers cleanly, e.g. 2.0 -> 2, 2.3 -> 2.3
const fmt = function (v) {
    return parseFloat(v.toFixed(1)).toString();
};

// Format the leading coefficient a
const fmtA = function (val) {
    const av = parseFloat(val.toFixed(1));
    if (av === 1) return '';
    if (av === -1) return '-';
    return fmt(av);
};

// Display: f(x) = a x^3
var ftextval = function () {
    const aval = a.Value();
    const aStr = fmtA(aval);
    return `\\( g(x) = ${aStr}x^3 \\)`;
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