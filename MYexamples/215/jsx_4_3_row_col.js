JXG.Options.text.useMathJax = true;

// Two side-by-side boards in the single container div the host page provides:
// left = columns of A, right = columns of rref(A). Same layout pattern as
// jsx_4_2_null_col.js.
var container = document.getElementById('jsx_4_3_row_col_fig');
container.style.display = 'flex';
container.style.gap = '16px';
container.style.alignItems = 'flex-start';
container.style.height = 'auto';

// Both boards are [-5,7,5,-5] (10 wide x 12 tall), so both divs get 5/6.
var leftDiv = document.createElement('div');
leftDiv.id = 'jsx_4_3_row_col_left';
leftDiv.className = 'jxgbox';
leftDiv.style.flex = '1';
leftDiv.style.height = 'auto';
leftDiv.style.aspectRatio = '5 / 6';
container.appendChild(leftDiv);

var rightDiv = document.createElement('div');
rightDiv.id = 'jsx_4_3_row_col_right';
rightDiv.className = 'jxgbox';
rightDiv.style.flex = '1';
rightDiv.style.height = 'auto';
rightDiv.style.aspectRatio = '5 / 6';
container.appendChild(rightDiv);

var COL_FILL = '#27ae60';
var COLORS = ['#378ADD', '#D85A30', '#8e44ad'];
var boxCss = 'background-color: rgba(255,255,255,0.9); padding: 4px; line-height: 1.6;';

function colTex(c) {
    return '\\begin{bmatrix} ' + c[0] + ' \\\\ ' + c[1] + ' \\end{bmatrix}';
}

// Builds one panel: the three columns as arrows (column 1 is the pivot
// column, drawn thicker), Col as a shaded line through column 1, and a
// readout box with the matrix, the column relations and Col.
function makePanel(id, cols, v, matTex, colName) {
    var board = JXG.JSXGraph.initBoard(id, {
        boundingbox: [-5, 7, 5, -5],
        axis: true,
        grid: true,
        showNavigation: false,
        showCopyright: false
    });

    board.create('line', [[0, 0], cols[0]], {
        strokeColor: COL_FILL, strokeWidth: 8, strokeOpacity: 0.35,
        fixed: true, highlight: false,
        point1: { visible: false }, point2: { visible: false }
    });

    // Unit normal to the Col line, so labels sit beside the shared line
    // instead of on top of the other (overlapping) arrows; the pivot label
    // goes on the opposite side from the other two
    var n = Math.hypot(cols[0][0], cols[0][1]);
    var nx = -cols[0][1] / n, ny = cols[0][0] / n;

    // Column 3 drawn first so the shorter pivot column 1 (same direction) sits on top
    [2, 1, 0].forEach(function (j) {
        var c = cols[j];
        board.create('arrow', [[0, 0], c], {
            strokeColor: COLORS[j], strokeWidth: j === 0 ? 3.5 : 2.5,
            fixed: true, highlight: false
        });
        var side = j === 0 ? -1 : 1;
        board.create('text', [
            c[0] + side * 0.6 * nx, c[1] + side * 0.6 * ny,
            '\\( \\vec{' + v + '}_' + (j + 1) + ' \\)' +
                (j === 0 ? ' <span style="font-size: 12px;">(pivot)</span>' : '')
        ], {
            fontSize: 16, color: COLORS[j],
            // Anchor on the side facing the line so wider labels grow away from it
            anchorX: Math.abs(nx) < 0.1 ? 'middle' : (side * nx > 0 ? 'left' : 'right'),
            anchorY: 'middle',
            cssStyle: 'white-space: nowrap;',
            fixed: true, highlight: false, parse: false, useMathJax: true
        });
    });

    function vc(j) { return '{\\color{' + COLORS[j] + '}\\vec{' + v + '}_' + (j + 1) + '}'; }

    board.create('text', [-4.9, 6.9,
        '\\( ' + matTex + ' \\)<br>' +
        '\\( ' + vc(1) + ' = -2' + vc(0) + ', \\quad ' + vc(2) + ' = 3' + vc(0) + ' \\)<br>' +
        '\\( {\\color{' + COL_FILL + '}' + colName + '} = \\operatorname{span}\\left\\{ ' + colTex(cols[0]) + ' \\right\\} \\)'
    ], {
        fontSize: 14, color: 'black', anchorY: 'top',
        cssStyle: boxCss, fixed: true, parse: false, useMathJax: true
    });

    return board;
}

// ==================== Left: A ====================
var leftBoard = makePanel('jsx_4_3_row_col_left',
    [[1, 2], [-2, -4], [3, 6]], 'a',
    'A = \\begin{bmatrix} 1 & -2 & 3 \\\\ 2 & -4 & 6 \\end{bmatrix}',
    '\\operatorname{Col}(A)');

// rref(A)'s pivot column, ghosted onto A's board: it is not in Col(A), which
// is why the basis must come from A's own pivot columns
leftBoard.create('arrow', [[0, 0], [1, 0]], {
    strokeColor: COLORS[0], strokeWidth: 3, strokeOpacity: 0.6, dash: 2,
    fixed: true, highlight: false
});
leftBoard.create('text', [1.3, -0.35, '\\( \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} \\notin \\operatorname{Col}(A) \\)'], {
    fontSize: 14, color: '#555555', anchorX: 'left', anchorY: 'top',
    cssStyle: 'background-color: rgba(255,255,255,0.9); padding: 2px; white-space: nowrap;',
    fixed: true, highlight: false, parse: false, useMathJax: true
});

// ==================== Right: rref(A) ====================
var rightBoard = makePanel('jsx_4_3_row_col_right',
    [[1, 0], [-2, 0], [3, 0]], 'r',
    '\\operatorname{rref}(A) = \\begin{bmatrix} 1 & -2 & 3 \\\\ 0 & 0 & 0 \\end{bmatrix}',
    '\\operatorname{Col}(\\operatorname{rref}(A))');

// JSXGraph typesets with MathJax's synchronous typeset(), which under MathJax 4
// can throw on a first render that needs lazily-loaded font data (tall
// brackets). That leaves stale half-processed items in MathJax's list, and every
// later typeset then fails on them -- so clear the list and redo it async.
function retypeset() {
    if (!window.MathJax || !MathJax.typesetPromise) return;
    MathJax.typesetClear();
    MathJax.typesetPromise([container]).then(syncIframeHeight).catch(function () {
        MathJax.typesetClear();
    });
}
retypeset();
window.addEventListener('load', retypeset);

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
