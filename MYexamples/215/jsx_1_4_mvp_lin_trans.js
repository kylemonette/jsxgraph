JXG.Options.text.useMathJax = true;

// Glues two unrelated, independently-configured boards side by side inside
// the single container div the host page provides for this file (following
// this project's `<basename>_fig` convention). Two child divs are injected
// into that container -- 'left' and 'right' -- and each original example's
// logic runs unmodified (verbatim from jsx_1_4_mvp.js / jsx_1_4_lin_trans.js,
// aside from retargeting initBoard at its own div) inside its own IIFE, so
// the two boards' identically-named variables (board, A, ...) never collide.
var container = document.getElementById('jsx_1_4_mvp_lin_trans_fig');
container.style.display = 'flex';
container.style.gap = '16px';
container.style.alignItems = 'flex-start';
// The host page's own CSS gives this div a fixed height (sized for a single
// full board); override it so the div shrinks to fit these two shorter
// boards instead of leaving empty space below them.
container.style.height = 'auto';

// Both boards use the same [-6,6,6,-6] boundingbox (square already), so both
// divs get the same 1/1 aspect-ratio -- height scales with width instead of
// being fixed, which is what makes the layout scale cleanly at any container
// width (e.g. a PreTeXt `width="50%"` on the <interactive> tag).
var leftDiv = document.createElement('div');
leftDiv.id = 'jsx_1_4_mvp_lin_trans_left';
leftDiv.className = 'jxgbox';
leftDiv.style.flex = '1';
leftDiv.style.height = 'auto';
leftDiv.style.aspectRatio = '1 / 1';
container.appendChild(leftDiv);

var rightDiv = document.createElement('div');
rightDiv.id = 'jsx_1_4_mvp_lin_trans_right';
rightDiv.className = 'jxgbox';
rightDiv.style.flex = '1';
rightDiv.style.height = 'auto';
rightDiv.style.aspectRatio = '1 / 1';
container.appendChild(rightDiv);

// ==================== Left: jsx_1_4_mvp ====================
(function () {
    var board = JXG.JSXGraph.initBoard('jsx_1_4_mvp_lin_trans_left', {
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
})();

// ==================== Right: jsx_1_4_lin_trans ====================
(function () {
    var board = JXG.JSXGraph.initBoard('jsx_1_4_mvp_lin_trans_right', {
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
})();

// Two sizing problems here live in the PreTeXt/Runestone iframe template
// this file is served through, not in anything above: (1) the iframe's own
// <body> carries a fixed min-height sized for a typical single full-size
// board, taller than this compact two-square layout needs; (2) the parent
// page separately pins the actual <iframe> element to a fixed square height
// regardless of what's inside. Neither is fixable from here by editing that
// external template, so both are overridden directly:
document.body.style.setProperty('min-height', 'auto', 'important');

function syncIframeHeight() {
    if (window.frameElement) {
        window.frameElement.style.height = document.body.getBoundingClientRect().height + 'px';
    }
}
syncIframeHeight();
window.addEventListener('load', syncIframeHeight);
