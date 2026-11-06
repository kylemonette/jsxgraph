JXG.Options.text.useMathJax = true;

// Glues two unrelated, independently-configured boards side by side inside
// the single container div the host page provides for this file (following
// this project's `<basename>_fig` convention). Two child divs are injected
// into that container -- 'left' and 'right' -- and each original example's
// logic runs unmodified (verbatim from jsx_1_3_vec.js / jsx_1_3_par.js,
// aside from retargeting initBoard at its own div) inside its own IIFE, so
// the two boards' identically-named variables (board, xAxis, yAxis, ...)
// never collide.
var container = document.getElementById('jsx_1_3_vec_par_fig');
container.style.display = 'flex';
container.style.gap = '16px';
container.style.alignItems = 'flex-start';
// The host page's own CSS gives this div a fixed height (sized for a single
// full board); override it so the div shrinks to fit these two shorter
// boards instead of leaving empty space below them.
container.style.height = 'auto';

// Both divs are forced square (1/1) -- each board's own boundingbox below is
// also square (vec: [-4,4,4,-4] is 8x8; par: [-1.5,6.5,6.5,-1.5] is 8x8), so
// keepAspectRatio never has to letterbox and the two panels end up equal in
// size. height is explicit 'auto' so it scales with width instead of being
// fixed -- this is what makes the layout scale cleanly at any container
// width (e.g. a PreTeXt `width="50%"` on the <interactive> tag).
var leftDiv = document.createElement('div');
leftDiv.id = 'jsx_1_3_vec_par_left';
leftDiv.className = 'jxgbox';
leftDiv.style.flex = '1';
leftDiv.style.height = 'auto';
leftDiv.style.aspectRatio = '1 / 1';
container.appendChild(leftDiv);

var rightDiv = document.createElement('div');
rightDiv.id = 'jsx_1_3_vec_par_right';
rightDiv.className = 'jxgbox';
rightDiv.style.flex = '1';
rightDiv.style.height = 'auto';
rightDiv.style.aspectRatio = '1 / 1';
container.appendChild(rightDiv);

// ==================== Left: jsx_1_3_vec ====================
(function () {
    var board = JXG.JSXGraph.initBoard('jsx_1_3_vec_par_left', {
        boundingbox: [-4, 4, 4, -4],
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        keepAspectRatio: true
    });

    // Manually build x and y axes with no tick marks
    var xAxis = board.create('axis', [[-4, 0], [4, 0]], {
        ticks: {
            visible: false,
            drawLabels: false,
            majorHeight: 0,
            minorHeight: 0
        },
        lastArrow: { size: 6 },
        firstArrow: { size: 6 },
        strokeColor: '#333333',
        name: ''
    });

    var yAxis = board.create('axis', [[0, -4], [0, 4]], {
        ticks: {
            visible: false,
            drawLabels: false,
            majorHeight: 0,
            minorHeight: 0
        },
        lastArrow: { size: 6 },
        firstArrow: { size: 6 },
        strokeColor: '#333333',
        name: ''
    });

    // Draggable terminal point
    var P = board.create('point', [1, 1], {
        name: '',
        size: 4,
        fillColor: '#0000FF',
        strokeColor: '#0000FF',
        showInfobox: false,
        snapToGrid: false
    });

    // Vector from origin to P
    var vec = board.create('arrow', [[0, 0], P], {
        strokeColor: '#c0392b',
        strokeWidth: 2,
        highlight: false
    });

    // LaTeX label showing the ordered pair, fixed (not draggable), offset from P
    var label = board.create('text', [
        function () { return P.X() + (P.X() >= 0 ? 0.3 : -1.6); },
        function () { return P.Y() + (P.Y() >= 0 ? 0.3 : -0.5); },
        function () {
            var x = P.X().toFixed(1).replace(/\.0$/, '');
            var y = P.Y().toFixed(1).replace(/\.0$/, '');
            return '\\(\\left(' + x + ', ' + y + '\\right)\\)';
        }
    ], {
        fixed: true,
        highlight: false,
        color: '#0000FF',
        fontSize: 16,
        useMathJax: true,
        anchorX: 'left',
        anchorY: 'middle'
    });
})();

// ==================== Right: jsx_1_3_par ====================
(function () {
    var LIMIT = 5;   // max x or y a terminal point (or the sum) may reach
    var MIN = -0.5;      // keep points off the axes so vectors stay visible

    // Square (8x8, matching the left board) with extra margin on top/right
    // beyond LIMIT=4.5 so the "u+v=(..)" label -- centered on the sum point,
    // so it grows in both directions -- has room and doesn't clip or wrap.
    var board = JXG.JSXGraph.initBoard('jsx_1_3_vec_par_right', {
        boundingbox: [-1.5, 6.5, 6.5, -1.5],
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        keepAspectRatio: true
    });

    // Manually build x and y axes with no tick marks
    var xAxis = board.create('axis', [[-0.8, 0], [4.6, 0]], {
        ticks: {
            visible: false,
            drawLabels: false,
            majorHeight: 0,
            minorHeight: 0
        },
        lastArrow: { size: 6 },
        firstArrow: { size: 6 },
        strokeColor: '#333333',
        name: ''
    });
    var yAxis = board.create('axis', [[0, -0.8], [0, 4.6]], {
        ticks: {
            visible: false,
            drawLabels: false,
            majorHeight: 0,
            minorHeight: 0
        },
        lastArrow: { size: 6 },
        firstArrow: { size: 6 },
        strokeColor: '#333333',
        name: ''
    });

    // Clamp a terminal point to quadrant 1, keeping the point AND the vector sum
    // inside the bounding box.
    function clamp(p, other) {
        var x = p.X(), y = p.Y();

        if (x < MIN) x = MIN;
        if (y < MIN) y = MIN;
        if (x > LIMIT) x = LIMIT;
        if (y > LIMIT) y = LIMIT;
        if (x + other.X() > LIMIT) x = LIMIT - other.X();
        if (y + other.Y() > LIMIT) y = LIMIT - other.Y();
        if (x < MIN) x = MIN;
        if (y < MIN) y = MIN;
        p.moveTo([x, y], 0);
    }

    // Terminal points for the two vectors
    var A = board.create('point', [3, 1], {
        name: '',
        size: 4,
        fillColor: '#0000FF',
        strokeColor: '#0000FF',
        showInfobox: false,
        snapToGrid: false
    });

    var B = board.create('point', [1, 2.5], {
        name: '',
        size: 4,
        fillColor: '#27ae60',
        strokeColor: '#27ae60',
        showInfobox: false,
        snapToGrid: false
    });

    A.on('drag', function () { clamp(A, B); });
    B.on('drag', function () { clamp(B, A); });

    // Sum point (parallelogram's far corner), follows A and B automatically
    var S = board.create('point', [
        function () { return A.X() + B.X(); },
        function () { return A.Y() + B.Y(); }
    ], {
        name: '',
        size: 0,
        withLabel: false,
        fixed: true,
        showInfobox: false,
        visible: false
    });

    // Lightly shaded parallelogram O, A, S, B
    var parallelogram = board.create('polygon', [[0, 0], A, S, B], {
        fillColor: '#8e44ad',
        fillOpacity: 0.15,
        borders: { visible: false },
        vertices: { visible: false },
        highlight: false
    });

    // The two vectors
    var vecA = board.create('arrow', [[0, 0], A], {
        strokeColor: '#0000FF',
        strokeWidth: 2,
        highlight: false
    });

    var vecB = board.create('arrow', [[0, 0], B], {
        strokeColor: '#27ae60',
        strokeWidth: 2,
        highlight: false
    });

    // Sum vector
    var vecSum = board.create('arrow', [[0, 0], S], {
        strokeColor: '#8e44ad',
        strokeWidth: 2,
        dash: 2,
        highlight: false
    });

    // Dashed guide edges completing the parallelogram (A to S, B to S)
    var guideA = board.create('segment', [A, S], {
        strokeColor: '#999999',
        strokeWidth: 1,
        dash: 2,
        highlight: false,
        fixed: true
    });
    var guideB = board.create('segment', [B, S], {
        strokeColor: '#999999',
        strokeWidth: 1,
        dash: 2,
        highlight: false,
        fixed: true
    });

    function fmt(n) {
        return n.toFixed(1).replace(/\.0$/, '');
    }

    // LaTeX labels for A, B, and the sum, fixed (not draggable)
    var labelA = board.create('text', [
        function () { return A.X() + 0.25; },
        function () { return A.Y() + 0.25; },
        function () { return '\\( \\vec{v} = \\left(' + fmt(A.X()) + ', ' + fmt(A.Y()) + '\\right)\\)'; }
    ], {
        fixed: true,
        highlight: false,
        color: '#0000FF',
        fontSize: 15,
        useMathJax: true,
        anchorX: 'left',
        anchorY: 'middle'
    });

    var labelB = board.create('text', [
        function () { return B.X() + 0.25; },
        function () { return B.Y() + 0.25; },
        function () { return '\\( \\vec{u}=\\left(' + fmt(B.X()) + ', ' + fmt(B.Y()) + '\\right)\\)'; }
    ], {
        fixed: true,
        highlight: false,
        color: '#27ae60',
        fontSize: 15,
        useMathJax: true,
        anchorX: 'right',
        anchorY: 'middle'
    });

    var labelS = board.create('text', [
        function () { return S.X() + 0.15; },
        function () { return S.Y() + 0.15; },
        function () { return '\\( \\vec{u} + \\vec{v} = \\left(' + fmt(S.X()) + ', ' + fmt(S.Y()) + '\\right)\\)'; }
    ], {
        fixed: true,
        highlight: false,
        color: '#8e44ad',
        fontSize: 15,
        useMathJax: true,
        anchorX: 'middle',
        anchorY: 'middle'
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
