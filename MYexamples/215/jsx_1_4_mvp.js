JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_1_4_mvp_fig', {
    boundingbox: [-6, 6, 6, -6],
    axis: true,
    grid: true,
    showNavigation: true,
    showCopyright: false
});

// Fixed transformation matrix A (never displayed on the board)
var A = [
    [1, 3],
    [-2, 0]
];

var LIMIT = 5;

// Given a candidate (px, py) for x, return the largest scale factor
// s <= 1 such that both (px,py)*s and A*(px,py)*s stay within
// [-LIMIT, LIMIT] in both coordinates.
function clampScale(px, py) {
    var ax = A[0][0] * px + A[0][1] * py;
    var ay = A[1][0] * px + A[1][1] * py;
    var s = 1;
    [px, py, ax, ay].forEach(function (v) {
        if (Math.abs(v) > 1e-9) {
            s = Math.min(s, LIMIT / Math.abs(v));
        }
    });
    return s;
}

// Draggable tip of the input vector x
var tipX = board.create('point', [1,0], {
    name: '',
    color: 'blue',
    size: 3,
    attractToGrid: true, attractorDistance: 10, attractorunit: 'screen' ,
    showInfobox: false
});

// Clamp tipX (and therefore tipY) to stay inside the -5..5 frame
tipX.on('drag', function () {
    var x = tipX.X();
    var y = tipX.Y();
    var s = clampScale(x, y);
    if (s < 1) {
        tipX.moveTo([x * s, y * s]);
    }
});

// Input vector x, drawn from the origin to tipX
var vecX = board.create('arrow', [[0, 0], tipX], {
    strokeColor: 'blue',
    strokeWidth: 2
});

// Output point y = A*x, recomputed live from tipX
var tipY = board.create('point', [
    function () { return A[0][0] * tipX.X() + A[0][1] * tipX.Y(); },
    function () { return A[1][0] * tipX.X() + A[1][1] * tipX.Y(); }
], {
    name: '',
    color: 'red',
    size: 3,
    fixed: true,
    showInfobox: false
});

// Output vector y, drawn from the origin to tipY
var vecY = board.create('arrow', [[0, 0], tipY], {
    strokeColor: 'red',
    strokeWidth: 2
});

// Format a coordinate to 2 decimal places, but drop trailing zeros
// e.g. 2.00 -> "2", 2.50 -> "2.5", 2.55 -> "2.55"
const fmt2 = function (v) {
    return parseFloat(v.toFixed(2)).toString();
};

// Formula box in the top-left showing the relation (A itself stays hidden)
// var ftext = board.create('text', [-5.8, 5.5, '\\( \\vec{y} = A\\vec{x} \\)'], {
//     fontSize: 14,
//     color: 'black',
//     cssStyle: 'background-color: rgb(255,255,255); padding: 4px;',
//     fixed: true,
//     parse: false,
//     useMathJax: true
// });

// Directional label offset: normally offsets up/right, but flips to
// down/left as the coordinate approaches the frame edge, so the label
// text never bleeds past the boundingbox
var LABEL_MARGIN = 0.35;   // distance label sits from the tip
var FLIP_THRESHOLD = LIMIT - 2;  // start flipping before hitting the wall

function labelDX(v) {
    return v > FLIP_THRESHOLD ? -LABEL_MARGIN : LABEL_MARGIN;
}
function labelDY(v) {
    return v > FLIP_THRESHOLD ? -LABEL_MARGIN : LABEL_MARGIN;
}
function labelAnchorX(v) {
    return v > FLIP_THRESHOLD ? 'right' : 'left';
}
function labelAnchorY(v) {
    return v > FLIP_THRESHOLD ? 'top' : 'bottom';
}

// Label showing x's coordinates, flips to stay inside the frame
var xLabel = board.create('text', [
    function () { return tipX.X() + labelDX(tipX.X()); },
    function () { return tipX.Y() + labelDY(tipX.Y()); },
    function () { return `\\( \\vec{x} = (${fmt2(tipX.X())}, ${fmt2(tipX.Y())}) \\)`; }
], {
    fontSize: 14,
    color: 'blue',
    anchorX: function () { return labelAnchorX(tipX.X()); },
    anchorY: function () { return labelAnchorY(tipX.Y()); },
    fixed: true,
    parse: false,
    useMathJax: true
});

// Label showing y's coordinates, flips to stay inside the frame
var yLabel = board.create('text', [
    function () { return tipY.X() + labelDX(tipY.X()); },
    function () { return tipY.Y() + labelDY(tipY.Y()); },
    function () { return `\\( \\vec{y} = (${fmt2(tipY.X())}, ${fmt2(tipY.Y())}) \\)`; }
], {
    fontSize: 14,
    color: 'red',
    anchorX: function () { return labelAnchorX(tipY.X()); },
    anchorY: function () { return labelAnchorY(tipY.Y()); },
    fixed: true,
    parse: false,
    useMathJax: true
});