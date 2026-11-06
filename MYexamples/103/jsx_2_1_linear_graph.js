JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_2_1_linear_graph_fig', {
boundingbox: [-5, 5, 5, -5],
axis: true,
grid: true,
showCopyright: false 
});
        

var bptx = board.create('glider',[0,1,board.defaultAxes.y],{attractToGrid: true, attractorDistance: 10, attractorunit: 'screen' , name: 'b', color: 'red', size: 3, fontSize: 16});

var xptx = board.create('point',[1,2], {attractToGrid: true, attractorDistance: 10, attractorunit: 'screen' ,  name:'', color: 'red', size:3});
var line2 = board.create("line",[bptx,xptx]);

const m = (xptx.Y() - bptx.Y()) / xptx.X();

const fmt = (v) => parseFloat(v.toFixed(2)).toString();

// Build a single term (always includes sign)
const buildTerm = (coef, variable) => {
    const v = parseFloat(coef.toFixed(2));
    if (v === 0) return '';

    const sign = v >= 0 ? '+' : '-';
    const abs = Math.abs(v);

    const coeffStr = (abs === 1 && variable) ? '' : fmt(abs);
    return `${sign}${coeffStr}${variable}`;
};

// Main text
var ftextval = function () {
    const terms = [
        buildTerm( (xptx.Y() - bptx.Y()) / xptx.X(), 'x'),
        buildTerm(bptx.Y(), '')
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
var ftext = board.create('text', [-4, 4, ftextval], {
    fixed: true,
    fontSize: 14,
    color: 'black',
    cssStyle: 'background-color: rgb(255,255,255)'
});