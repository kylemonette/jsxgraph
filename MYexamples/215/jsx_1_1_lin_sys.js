JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_1_1_lin_sys_fig', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});

// Format numbers cleanly, e.g. 2.0 -> 2, 2.3 -> 2.3
const fmt = function (v) {
    return parseFloat(v.toFixed(1)).toString();
};

// Format a signed term like " + 3" / " - 3" / "" when zero
const fmtSignedTerm = function (v) {
    const vv = parseFloat(v.toFixed(1));
    if (vv === 0) {
        return '';
    }
    if (vv > 0) {
        return ` + ${fmt(vv)}`;
    }
    return ` - ${fmt(Math.abs(vv))}`;
};

// Sliders controlling the two right-hand sides and the row-2 y-coefficient
var b1 = board.create('slider', [[-9.5, -7], [-4.5, -7], [-6, -1, 6]], {
    name: '\\(b_1\\)', snapWidth: 0.5, strokeColor: '#185FA5', fillColor: '#185FA5'
});
var b2 = board.create('slider', [[-9.5, -8], [-4.5, -8], [-6, 3, 6]], {
    name: '\\(b_2\\)', snapWidth: 0.5, strokeColor: '#A32D2D', fillColor: '#A32D2D'
});
var c = board.create('slider', [[-9.5, -9], [-4.5, -9], [0.5, 3, 4]], {
    name: '\\(c\\)', snapWidth: 0.5, strokeColor: '#A32D2D', fillColor: '#A32D2D'
});

// Equation 1: x - 2y = b1
var eq1textval = function () {
    const b1v = b1.Value();
    return `\\( x - 2y = ${fmt(b1v)} \\)`;
};
var eq1text = board.create('text', [-9.5, 9.2, eq1textval], {
    fontSize: 14,
    color: '#185FA5',
    cssStyle: 'background-color: rgb(255,255,255); padding: 4px;',
    fixed: true,
    parse: false,
    useMathJax: true
});

// Equation 2: -x + c y = b2
var eq2textval = function () {
    const cv = c.Value();
    const b2v = b2.Value();
    return `\\( -x + ${fmt(cv)}y = ${fmt(b2v)} \\)`;
};
var eq2text = board.create('text', [-9.5, 8, eq2textval], {
    fontSize: 14,
    color: '#A32D2D',
    cssStyle: 'background-color: rgb(255,255,255); padding: 4px;',
    fixed: true,
    parse: false,
    useMathJax: true
});

// Verdict line: unique solution, no solution, or infinitely many
var verdicttextval = function () {
    const denom = c.Value() - 2;
    if (Math.abs(denom) > 1e-9) {
        const y = (b1.Value() + b2.Value()) / denom;
        const x = b1.Value() + 2 * y;
        return `\\( \\text{Solution: } (${fmt(x)}, ${fmt(y)}) \\)`;
    }
    const infinite = Math.abs(b1.Value() + b2.Value()) < 1e-9;
    return infinite
        ? '\\( \\text{Infinitely many solutions} \\)'
        : '\\( \\text{No solution} \\)';
};
var verdicttext = board.create('text', [-9.5, 6.5, verdicttextval], {
    fontSize: 14,
    color: 'black',
    cssStyle: 'background-color: rgb(255,255,255); padding: 4px;',
    fixed: true,
    parse: false,
    useMathJax: true
});

// The two lines, always driven by the current slider values
var line1 = board.create('functiongraph', [function (x) {
    return (x - b1.Value()) / 2;
}], { strokeColor: '#185FA5', strokeWidth: 2 });

var line2 = board.create('functiongraph', [function (x) {
    const cv = c.Value();
    if (Math.abs(cv) < 1e-9) return NaN;
    return (b2.Value() + x) / cv;
}], { strokeColor: '#A32D2D', strokeWidth: 2 });

// Solution point, shown only when the system has exactly one solution
var solPoint = board.create('point', [
    function () {
        const denom = c.Value() - 2;
        if (Math.abs(denom) < 1e-9) return NaN;
        const y = (b1.Value() + b2.Value()) / denom;
        return b1.Value() + 2 * y;
    },
    function () {
        const denom = c.Value() - 2;
        if (Math.abs(denom) < 1e-9) return NaN;
        return (b1.Value() + b2.Value()) / denom;
    }
], {
    name: function () {
        const denom = c.Value() - 2;
        if (Math.abs(denom) < 1e-9) return '';
        const y = (b1.Value() + b2.Value()) / denom;
        const x = b1.Value() + 2 * y;
        // return `(${fmt(x)}, ${fmt(y)})`;
        return ''
    },
    size: 4,
    fillColor: '#0F6E56',
    strokeColor: '#0F6E56',
    fixed: true,
    showInfobox: false,
    label: { fontSize: 13, color: '#0F6E56', offset: [8, 8], fixed: true }
});

// Recolor line2 depending on parallel / coincident / crossing, after every redraw
board.on('update', function () {
    const denom = c.Value() - 2;
    if (Math.abs(denom) > 1e-9) {
        line2.setAttribute({ strokeColor: '#A32D2D', strokeWidth: 2 });
    } else if (Math.abs(b1.Value() + b2.Value()) < 1e-9) {
        line2.setAttribute({ strokeColor: '#0F6E56', strokeWidth: 4 });
    } else {
        line2.setAttribute({ strokeColor: '#A32D2D', strokeWidth: 2 });
    }
});
board.update();

