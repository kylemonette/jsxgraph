JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_5_2_exp_fun_fig', {
boundingbox: [-10, 10, 10, -4],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});
var b = board.create('slider', [[2, -1], [7, -1], [0.1, 1.5, 3]], {
    name: 'b',
    snapWidth: 0.1,
    precision: 1
});
var a = board.create('slider', [[2, -2], [7, -2], [0.1, 2, 3]], {
    name: 'A',
    snapWidth: 0.1,
    precision: 1
});
var f = board.create('functiongraph', [
    function (x) {
        return a.Value() * (b.Value()) ** x;
    }
]);

// Format numbers cleanly, e.g. 2.0 -> 2, 2.3 -> 2.3
const fmt = function (v) {
    return parseFloat(v.toFixed(1)).toString();
};

// Format the leading coefficient A
const fmtA = function (val) {
    const av = parseFloat(val.toFixed(1));
    // if (av === 1) return '';
    // f (av === -1) return '-';
    return fmt(av);
};

// Exponential form display: f(x) = A b^x
var ftextval = function () {
    const aval = a.Value();
    const bval = b.Value();
    const aStr = fmtA(aval);
    const bStr = fmt(bval);
    return `\\( f(x) = ${aStr} \\cdot (${bStr})^x \\)`;
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