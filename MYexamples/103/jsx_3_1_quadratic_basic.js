

JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_3_1_quadratic_basic_fig', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    showCopyright: false
});


var a = board.create('slider', [[2, -5], [7, -5], [-5, 1, 5]], {
    name: 'a',
    snapWidth: 0.1,
    precision: 1
});

var b = board.create('slider', [[2, -6], [7, -6], [-5, 2, 5]], {
    name: 'b',
    snapWidth: 0.1,
    precision: 1
});

var c = board.create('slider', [[2, -7], [7, -7], [-5, -3, 5]], {
    name: 'c',
    snapWidth: 0.1,
    precision: 1
});

var f = board.create('functiongraph', [
    function (x) {
        return a.Value() * x * x + b.Value() * x + c.Value();
    }
]);

// Helper: format number (removes .0)
const fmt = (v) => parseFloat(v.toFixed(1)).toString();

// Build a single term (always includes sign)
const buildTerm = (coef, variable) => {
    const v = parseFloat(coef.toFixed(1));
    if (v === 0) return '';

    const sign = v >= 0 ? '+' : '-';
    const abs = Math.abs(v);

    const coeffStr = (abs === 1 && variable) ? '' : fmt(abs);
    return `${sign}${coeffStr}${variable}`;
};

// Main text
var ftextval = function () {
    const terms = [
        buildTerm(a.Value(), 'x^2'),
        buildTerm(b.Value(), 'x'),
        buildTerm(c.Value(), '')
    ].filter(t => t !== '');
    if (terms.length === 0) {
        return '\\(f(x) = 0\\)';
    }
    // Join and remove leading '+'
    let expr = terms.join(' ');
    expr = expr.replace(/^\+/, '');  // remove leading '+'

    return `\\(f(x) = ${expr}\\)`;
};

// Display text
var ftext = board.create('text', [-9.2, 8, ftextval], {
    fontSize: 14,
    color: 'black',
    cssStyle: 'background-color: rgb(255,255,255)',
    fixed: true
});

// --- Helper values ---
const disc = () => b.Value() * b.Value() - 4 * a.Value() * c.Value();

// --- Vertex ---
var vertex = board.create('point', [
    () => -b.Value() / (2 * a.Value()),
    () => {
        const x = -b.Value() / (2 * a.Value());
        return a.Value() * x * x + b.Value() * x + c.Value();
    }
], {
    name: '',
    size: 3,
    color: 'red'
});

board.create('text', [
    () => vertex.X() + 0.3,
    () => vertex.Y() + 0.3,
    // () => `\\((${vertex.X().toFixed(2)}, ${vertex.Y().toFixed(2)})\\)`
    () => `vertex`
], { parse: false });

// --- y-intercept ---
var yint = board.create('point', [
    0,
    () => c.Value()
], {
    name: '',
    size: 3,
    color: 'blue'
});

board.create('text', [
    () => 0.3,
    () => c.Value() + 0.3,
    // () => `\\((0, ${c.Value().toFixed(2)})\\)`
    () => `y-intercept`
], { parse: false });

// --- x-intercepts (conditional) ---
var xint1 = board.create('point', [
    () => {
        if (disc() < 0) return NaN;
        return (-b.Value() + Math.sqrt(disc())) / (2 * a.Value());
    },
    0
], {
    name: '',
    size: 3,
    color: 'green'
});

var xint2 = board.create('point', [
    () => {
        if (disc() < 0) return NaN;
        return (-b.Value() - Math.sqrt(disc())) / (2 * a.Value());
    },
    0
], {
    name: '',
    size: 3,
    color: 'green'
});

// Labels for x-intercepts
board.create('text', [
    () => xint1.X() + 0.3,
    () => 0.3,
    // () => (disc() >= 0 ? `\\((${xint1.X().toFixed(2)}, 0)\\)` : '')
    () => (disc() >= 0 ? `x-intercept` : '')
], { parse: false });

board.create('text', [
    () => xint2.X() + 0.3,
    () => 0.3,
    // () => (disc() >= 0 ? `\\((${xint2.X().toFixed(2)}, 0)\\)` : '')
    () => (disc() >= 0 ? `x-intercept` : '')
], { parse: false });


// JXG.Options.text.useMathJax = true;

// var board = JXG.JSXGraph.initBoard('3_1_quadratic_basic_fig', {boundingbox: [-10, 10, 10, -10], axis: true, showCopyright:false});
// board.options.text.useMathjax = true;

// var a = board.create('slider', [[2, -5], [7, -5], [-5, 1, 5]], { name: 'a' , snapWidth: 0.1, precision: 1});
// var b = board.create('slider', [[2, -6], [7, -6], [-5, 2, 5]], { name: 'b' , snapWidth: 0.1, precision: 1});
// var c = board.create('slider', [[2, -7], [7, -7], [-5, -3, 5]], { name: 'c' , snapWidth: 0.1, precision: 1});

// var f = board.create('functiongraph', [
//     function(x) {
//         return a.Value() * x * x + b.Value() * x + c.Value();
//     }
// ]);

// // board.create('text', [-7, -7,
// //         () => `\\(f(x) = ${a.Value().toFixed(2)} x^2 + ${b.Value().toFixed(2)} x + ${c.Value().toFixed(2)}\\)`   // JavaScript template literal
// // ], { fontSize: 15 , parse: true});

// // var ftextval = board.create('text', [-9, 8,
// //     () => {
// //         const av = a.Value().toFixed(1);
// //         const bv = b.Value().toFixed(1);
// //         const cv = c.Value().toFixed(1);

// //         const bStr = (b.Value() >= 0 ? `+ ${bv}` : `- ${Math.abs(bv)}`);
// //         const cStr = (c.Value() >= 0 ? `+ ${cv}` : `- ${Math.abs(cv)}`);

// //         return `\\(f(x) = ${av}x^2 ${bStr}x ${cStr}\\)`;
// //     }
// // ], { fontSize: 14, parse: false });

// var ftextval = function (){
// const av = a.Value().toFixed(1);
// const bv = b.Value().toFixed(1);
// const cv = c.Value().toFixed(1);

// const bStr = (b.Value() >= 0 ? `+ ${bv}` : `- ${Math.abs(bv)}`);
// const cStr = (c.Value() >= 0 ? `+ ${cv}` : `- ${Math.abs(cv)}`);

// return `\\(f(x) = ${av}x^2 ${bStr}x ${cStr}\\)`;
// }

// // Show the text with white background
// var ftext = board.create('text', [-9, 8, ftextval], {
//     fontSize: 14,
//     color: 'black',
//     cssStyle: 'background-color: rgb(255,255,255)'
// });

