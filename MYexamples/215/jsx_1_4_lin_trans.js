JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_1_4_lin_trans_fig', {
    boundingbox: [-6, 6, 6, -6],
    axis: true,
    grid: false,
    showNavigation: true,
    showCopyright: false
});

// Fixed transformation matrix A (never displayed on the board)
var A = [
    [1, 3],
    [-2, 0]
];

function applyA(px, py) {
    return [
        A[0][0] * px + A[0][1] * py,
        A[1][0] * px + A[1][1] * py
    ];
}

var GRID_MIN = -6, GRID_MAX = 6, GRID_STEP = 1;

var gridLines = [];
for (var k = GRID_MIN; k <= GRID_MAX; k += GRID_STEP) gridLines.push(k);

// Static, unmodified xy-plane grid underneath (light gray, dashed)
gridLines.forEach(function (k) {
    board.create('line', [[k, 0], [k, 1]], {
        strokeColor: 'gray', strokeWidth: k === 0 ? 1.5 : 1, dash: 2,
        fixed: true, highlight: false, straightFirst: true, straightLast: true
    });
    board.create('line', [[0, k], [1, k]], {
        strokeColor: 'gray', strokeWidth: k === 0 ? 1.5 : 1, dash: 2,
        fixed: true, highlight: false, straightFirst: true, straightLast: true
    });
});

// Slider t in [0, 1]: 0 = original grid, 1 = fully transformed (A * grid)
var t = board.create('slider', [[-5.5, -4.7], [-1.5, -4.7], [0, 0, 1]], {
    name: '',
    snapWidth: 0.01,
    precision: 2
});

// Build one animated grid line from two nearby defining points (JSXGraph's
// 'line' type auto-extends to fill the board, so the points only need to
// define position + direction — no need for far-off endpoints)
function makeAnimatedLine(x1, y1, x2, y2, color, width) {
    var p1 = board.create('point', [
        function () { var img = applyA(x1, y1); var tv = t.Value(); return (1 - tv) * x1 + tv * img[0]; },
        function () { var img = applyA(x1, y1); var tv = t.Value(); return (1 - tv) * y1 + tv * img[1]; }
    ], { visible: false, fixed: true });

    var p2 = board.create('point', [
        function () { var img = applyA(x2, y2); var tv = t.Value(); return (1 - tv) * x2 + tv * img[0]; },
        function () { var img = applyA(x2, y2); var tv = t.Value(); return (1 - tv) * y2 + tv * img[1]; }
    ], { visible: false, fixed: true });

    board.create('line', [p1, p2], {
        strokeColor: color, strokeWidth: width, highlight: false,
        straightFirst: true, straightLast: true
    });
}

// Animated vertical lines (constant x = k), colored blue; animated
// horizontal lines (constant y = k), colored coral. The axes (k = 0)
// are drawn thicker in black. Each is defined by two points one unit
// apart along the original line.
gridLines.forEach(function (k) {
    if (k === 0) {
        makeAnimatedLine(0, 0, 0, 1, 'black', 2);
        makeAnimatedLine(0, 0, 1, 0, 'black', 2);
    } else {
        makeAnimatedLine(k, 0, k, 1, '#378ADD', 1);
        makeAnimatedLine(0, k, 1, k, '#D85A30', 1);
    }
});

// Highlighted unit square (0,0)-(1,1), filled and animated the same way
// as the grid lines, so its motion into A's parallelogram is unmistakable
var unitCorners = [[0, 0], [1, 0], [1, 1], [0, 1]];
var unitPts = unitCorners.map(function (c) {
    return board.create('point', [
        function () { var img = applyA(c[0], c[1]); var tv = t.Value(); return (1 - tv) * c[0] + tv * img[0]; },
        function () { var img = applyA(c[0], c[1]); var tv = t.Value(); return (1 - tv) * c[1] + tv * img[1]; }
    ], { visible: false, fixed: true });
});
var unitSquare = board.create('polygon', unitPts, {
    fillColor: '#EF9F27',
    fillOpacity: 0.5,
    borders: { strokeColor: '#854F0B', strokeWidth: 2.5 }
});

