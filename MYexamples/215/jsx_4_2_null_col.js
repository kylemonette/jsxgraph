JXG.Options.text.useMathJax = true;

// Two side-by-side boards in the single container div the host page provides:
// left = domain (x, Null(A)), right = codomain (Ax, Col(A)). Same layout
// pattern as jsx_1_4_mvp_lin_trans.js, but here the boards share state (the
// current matrix A and x), so it lives in this outer scope and the left board
// drives the right one via addChild.
var container = document.getElementById('jsx_4_2_null_col_fig');
container.style.display = 'flex';
container.style.gap = '16px';
container.style.alignItems = 'flex-start';
container.style.height = 'auto';

// Both boards are [-6,6,6,-6] (square), so both divs get 1/1.
var leftDiv = document.createElement('div');
leftDiv.id = 'jsx_4_2_null_col_left';
leftDiv.className = 'jxgbox';
leftDiv.style.flex = '1';
leftDiv.style.height = 'auto';
leftDiv.style.aspectRatio = '1 / 1';
container.appendChild(leftDiv);

var rightDiv = document.createElement('div');
rightDiv.id = 'jsx_4_2_null_col_right';
rightDiv.className = 'jxgbox';
rightDiv.style.flex = '1';
rightDiv.style.height = 'auto';
rightDiv.style.aspectRatio = '1 / 1';
container.appendChild(rightDiv);

// nul / col are direction vectors, only used for the rank 1 preset (rank 2
// and rank 0 have {0} or all of R^2 instead of a line).
var PRESETS = [
    {
        label: 'Ex. 1', rank: 2,
        A: [[2, -1], [1, 1]],
        tex: '\\begin{bmatrix} 2 & -1 \\\\ 1 & 1 \\end{bmatrix}',
        nulTex: '\\{\\vec{0}\\}',
        colTex: '\\mathbb{R}^2'
    },
    {
        label: 'Ex. 2', rank: 1,
        A: [[1, 1], [2, 2]],
        nul: [1, -1], col: [1, 2],
        tex: '\\begin{bmatrix} 1 & 1 \\\\ 2 & 2 \\end{bmatrix}',
        nulTex: '\\operatorname{span}\\left\\{ \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} \\right\\}',
        colTex: '\\operatorname{span}\\left\\{ \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} \\right\\}'
    },
    {
        label: 'Ex. 3', rank: 0,
        A: [[0, 0], [0, 0]],
        tex: '\\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}',
        nulTex: '\\mathbb{R}^2',
        colTex: '\\{\\vec{0}\\}'
    }
];
var P = PRESETS[1];

var LIMIT = 5;
var BIG = 100;  // "whole plane" polygons extend well past the board, so panning never shows an edge

var NUL_FILL = '#EF9F27', NUL_STROKE = '#854F0B';
var COL_FILL = '#27ae60', COL_STROKE = '#1e8449';

function applyA(px, py) {
    return [
        P.A[0][0] * px + P.A[0][1] * py,
        P.A[1][0] * px + P.A[1][1] * py
    ];
}

// Largest s <= 1 such that both (px,py)*s and A*(px,py)*s stay in [-LIMIT, LIMIT]
function clampScale(px, py) {
    var a = applyA(px, py);
    var s = 1;
    [px, py, a[0], a[1]].forEach(function (v) {
        if (Math.abs(v) > 1e-9) {
            s = Math.min(s, LIMIT / Math.abs(v));
        }
    });
    return s;
}

// Labels sit up/right of a tip, flipping down/left near the frame edge
var LABEL_MARGIN = 0.35;
var FLIP_THRESHOLD = LIMIT - 2;
function labelD(v) { return v > FLIP_THRESHOLD ? -LABEL_MARGIN : LABEL_MARGIN; }
function labelAnchorX(v) { return v > FLIP_THRESHOLD ? 'right' : 'left'; }
function labelAnchorY(v) { return v > FLIP_THRESHOLD ? 'top' : 'bottom'; }

var boardAttr = {
    boundingbox: [-6, 6, 6, -6],
    axis: true,
    grid: true,
    showNavigation: false,
    showCopyright: false
};
var leftBoard = JXG.JSXGraph.initBoard('jsx_4_2_null_col_left', boardAttr);
var rightBoard = JXG.JSXGraph.initBoard('jsx_4_2_null_col_right', boardAttr);
leftBoard.addChild(rightBoard);

var planeCorners = [[-BIG, BIG], [BIG, BIG], [BIG, -BIG], [-BIG, -BIG]];
function planeAttr(fill) {
    return {
        fillColor: fill, fillOpacity: 0.2,
        fixed: true, highlight: false, hasInnerPoints: false,
        borders: { visible: false },
        vertices: { visible: false }
    };
}
function lineAttr(fill) {
    return {
        strokeColor: fill, strokeWidth: 6, strokeOpacity: 0.7,
        fixed: true, highlight: false,
        point1: { visible: false }, point2: { visible: false }
    };
}
function originAttr(fill, stroke) {
    return {
        name: '', size: 6, fillColor: fill, strokeColor: stroke,
        fixed: true, highlight: false, showInfobox: false
    };
}
var boxCss = 'background-color: rgba(255,255,255,0.9); padding: 4px;';

// ==================== Left: domain ====================
var nulPlane = leftBoard.create('polygon', planeCorners, planeAttr(NUL_FILL));
var nulLine = leftBoard.create('line', [[0, 0], PRESETS[1].nul], lineAttr(NUL_FILL));
var nulPoint = leftBoard.create('point', [0, 0], originAttr(NUL_FILL, NUL_STROKE));

var tipX = leftBoard.create('point', [1, 1], {
    name: '',
    color: 'blue',
    size: 3,
    attractToGrid: true, attractorDistance: 10, attractorunit: 'screen',
    showInfobox: false
});
tipX.on('drag', function () {
    var s = clampScale(tipX.X(), tipX.Y());
    if (s < 1) {
        tipX.moveTo([tipX.X() * s, tipX.Y() * s]);
    }
});

leftBoard.create('arrow', [[0, 0], tipX], {
    strokeColor: 'blue', strokeWidth: 2, fixed: true, highlight: false
});

leftBoard.create('text', [
    function () { return tipX.X() + labelD(tipX.X()); },
    function () { return tipX.Y() + labelD(tipX.Y()); },
    '\\( \\vec{x} \\)'
], {
    fontSize: 14,
    color: 'blue',
    anchorX: function () { return labelAnchorX(tipX.X()); },
    anchorY: function () { return labelAnchorY(tipX.Y()); },
    cssStyle: 'white-space: nowrap;',
    fixed: true,
    parse: false,
    useMathJax: true
});

leftBoard.create('text', [-5.8, 5.8, function () {
    return '\\( A = ' + P.tex + ' \\quad \\operatorname{Null}(A) = ' + P.nulTex + ' \\)';
}], {
    fontSize: 14, color: 'black', anchorY: 'top',
    cssStyle: boxCss, fixed: true, parse: false, useMathJax: true
});

leftBoard.create('text', [5.8, -5.8, '\\( \\mathbb{R}^n \\) (domain)'], {
    fontSize: 14, color: '#555555', anchorX: 'right', anchorY: 'bottom',
    cssStyle: boxCss, fixed: true, parse: false, useMathJax: true
});

// ==================== Right: codomain ====================
var colPlane = rightBoard.create('polygon', planeCorners, planeAttr(COL_FILL));
var colLine = rightBoard.create('line', [[0, 0], PRESETS[1].col], lineAttr(COL_FILL));
var colPoint = rightBoard.create('point', [0, 0], originAttr(COL_FILL, COL_STROKE));

var tipAx = rightBoard.create('point', [
    function () { return applyA(tipX.X(), tipX.Y())[0]; },
    function () { return applyA(tipX.X(), tipX.Y())[1]; }
], {
    name: '',
    color: 'red',
    size: 3,
    fixed: true,
    showInfobox: false
});

rightBoard.create('arrow', [[0, 0], tipAx], {
    strokeColor: 'red', strokeWidth: 2, fixed: true, highlight: false
});

rightBoard.create('text', [
    function () { return tipAx.X() + labelD(tipAx.X()); },
    function () { return tipAx.Y() + labelD(tipAx.Y()); },
    '\\( A\\vec{x} \\)'
], {
    fontSize: 14,
    color: 'red',
    anchorX: function () { return labelAnchorX(tipAx.X()); },
    anchorY: function () { return labelAnchorY(tipAx.Y()); },
    cssStyle: 'white-space: nowrap;',
    fixed: true,
    parse: false,
    useMathJax: true
});

rightBoard.create('text', [-5.8, 5.8, function () {
    return '\\( \\operatorname{Col}(A) = ' + P.colTex + ' \\)';
}], {
    fontSize: 14, color: 'black', anchorY: 'top',
    cssStyle: boxCss, fixed: true, parse: false, useMathJax: true
});

rightBoard.create('text', [5.8, -5.8, '\\( \\mathbb{R}^m \\) (codomain)'], {
    fontSize: 14, color: '#555555', anchorX: 'right', anchorY: 'bottom',
    cssStyle: boxCss, fixed: true, parse: false, useMathJax: true
});

// JSXGraph typesets with MathJax's synchronous typeset(), which under MathJax 4
// can throw on a first render that needs lazily-loaded font data (\mathbb, tall
// brackets). That leaves stale half-processed items in MathJax's list, and every
// later typeset then fails on them -- so clear the list and redo it async.
function retypeset() {
    if (!window.MathJax || !MathJax.typesetPromise) return;
    MathJax.typesetClear();
    MathJax.typesetPromise([container]).then(syncIframeHeight).catch(function () {
        MathJax.typesetClear();
    });
}
window.addEventListener('load', retypeset);

// ==================== Presets ====================
var buttons = PRESETS.map(function (preset, i) {
    return leftBoard.create('button', [-5.8 + 2.2 * i, -5.4, preset.label, function () {
        setPreset(i);
    }], { fixed: true });
});

function setPreset(i) {
    P = PRESETS[i];

    nulPlane.setAttribute({ visible: P.rank === 0 });
    nulLine.setAttribute({ visible: P.rank === 1 });
    nulPoint.setAttribute({ visible: P.rank === 2 });
    colPlane.setAttribute({ visible: P.rank === 2 });
    colLine.setAttribute({ visible: P.rank === 1 });
    colPoint.setAttribute({ visible: P.rank === 0 });

    buttons.forEach(function (btn, j) {
        btn.rendNodeButton.style.fontWeight = j === i ? 'bold' : 'normal';
    });

    // The new A may send the current x's image out of frame
    var s = clampScale(tipX.X(), tipX.Y());
    if (s < 1) {
        tipX.moveTo([tipX.X() * s, tipX.Y() * s]);
    }
    leftBoard.update();
    retypeset();
}
setPreset(1);

// PreTeXt iframe sizing fix (see CLAUDE.md): the iframe's <body> has a fixed
// min-height and the parent page pins the <iframe> to a square height, both
// sized for a single full board rather than this two-panel layout.
document.body.style.setProperty('min-height', 'auto', 'important');

function syncIframeHeight() {
    if (window.frameElement) {
        window.frameElement.style.height = document.body.getBoundingClientRect().height + 'px';
    }
}
syncIframeHeight();
window.addEventListener('load', syncIframeHeight);
