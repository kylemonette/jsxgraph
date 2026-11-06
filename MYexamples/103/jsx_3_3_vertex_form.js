JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_3_3_vertex_form_fig', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    showCopyright: false
});

var vertex_ptx = board.create('point', [1, 2], {
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

var a = board.create('slider', [[2, -5], [7, -5], [-5, 1, 5]], {
    name: 'a',
    snapWidth: 0.1,
    precision: 1
});

var f = board.create('functiongraph', [
    function (x) {
        return a.Value() * (x - vertex_ptx.X()) ** 2 + vertex_ptx.Y();
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

// Format the horizontal shift h in (x - h)^2
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

// Vertex form display
var ftextval = function () {
    const aval = a.Value();
    const h = vertex_ptx.X();
    const k = vertex_ptx.Y();

    const aStr = fmtA(aval);
    const shiftStr = fmtHorizontalShift(h);
    const kStr = fmtVerticalShift(k);

    return `\\( f(x) = ${aStr}(${shiftStr})^2${kStr} \\)`;
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