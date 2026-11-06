JXG.Options.text.useMathJax = true;

// The two vectors that define the shaded plane (span{v1, v2})
var v1 = [2, 2, 0], v2 = [1, 1, -1],
// v3 is NOT in span{v1, v2}; w3 IS in span{v1, v2}
 v3 = [-1, 0, 1],
 w3 = [-5, -5, 1],
// How many multiples of v1/v2 the parallelogram grid and shaded plane extend to
 GRID_RANGE = 2;

var board = JXG.JSXGraph.initBoard('jsx_1_7_lin_indep_fig', {
    boundingbox: [-6, 6, 6.5, -6.5],
    axis: false,
    showCopyright: false,
    showNavigation: false
});

// Viewport leaves a 2-unit strip at the top (y: 4..6) for the banner and
// checkboxes, so they sit clear of the board's border instead of on it.
var view = board.create('view3d', [
    [-6, -6.5], [12.5, 10.5],
    [[-5, 5], [-5, 5], [-2.5, 2.5]]
], {
    xPlaneRear: { visible: false },
    yPlaneRear: { visible: false },
    zPlaneRear: { visible: false },
    xAxis: { strokeColor: '#aaaaaa', strokeWidth: 1, withLabel: false, name: '' },
    yAxis: { strokeColor: '#aaaaaa', strokeWidth: 1, withLabel: false, name: '' },
    zAxis: { strokeColor: '#aaaaaa', strokeWidth: 1, withLabel: false, name: '' }
});

function scale(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
}
function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

// Shaded translucent parallelogram covering the span of v1 and v2
var planeCorners = [
    add(scale(v1, GRID_RANGE), scale(v2, GRID_RANGE)),
    add(scale(v1, GRID_RANGE), scale(v2, -GRID_RANGE)),
    add(scale(v1, -GRID_RANGE), scale(v2, -GRID_RANGE)),
    add(scale(v1, -GRID_RANGE), scale(v2, GRID_RANGE))
];
view.create('polygon3d', planeCorners, {
    fillColor: '#999999',
    fillOpacity: 0.12,
    highlight: false,
    fixed: true,
    borders: { visible: false },
    vertices: { visible: false, withLabel: false }
});

// Parallelogram grid: lines parallel to v1 (offset by integer steps of v2)
// and lines parallel to v2 (offset by integer steps of v1) -- this is the
// "coordinate system" of the plane spanned by v1 and v2.
for (var k = -GRID_RANGE; k <= GRID_RANGE; k++) {
    var isMain = k === 0;
    var gridAttr = {
        strokeColor: isMain ? '#888888' : '#cccccc',
        strokeWidth: isMain ? 1.5 : 1,
        highlight: false,
        fixed: true,
        point1: { visible: false, name: '' },
        point2: { visible: false, name: '' }
    };

    view.create('line3d', [
        add(scale(v2, k), scale(v1, -GRID_RANGE)),
        add(scale(v2, k), scale(v1, GRID_RANGE))
    ], gridAttr);

    view.create('line3d', [
        add(scale(v1, k), scale(v2, -GRID_RANGE)),
        add(scale(v1, k), scale(v2, GRID_RANGE))
    ], gridAttr);
}

// Small dot marking the origin
view.create('point3d', [0, 0, 0], {
    size: 2, fillColor: 'black', strokeColor: 'black',
    name: '', withLabel: false, fixed: true, highlight: false
});

// Draws a static arrow from the origin to `tip`, with a MathJax label
// floating just beyond the tip. `visFn`, if given, controls visibility
// of both the arrow and its label (used for the v3/w3 toggles).
function vector3d(tip, color, labelTex, visFn) {
    var vecAttr = {
        strokeColor: color,
        strokeWidth: 2.5,
        lastArrow: { size: 4 },
        highlight: false,
        fixed: true,
        point1: { visible: false, name: '' },
        point2: { visible: false, name: '' }
    };
    var labelAttr = {
        useMathJax: true,
        color: color,
        fontSize: 16,
        highlight: false,
        fixed: true,
        anchorX: 'middle',
        anchorY: 'middle'
    };
    if (visFn) {
        vecAttr.visible = visFn;
        labelAttr.visible = visFn;
    }

    var vec = view.create('line3d', [[0, 0, 0], tip], vecAttr);
    var label = view.create('text3d', [
        [tip[0] * 1.18, tip[1] * 1.18, tip[2] * 1.18],
        labelTex
    ], labelAttr);

    return { vec: vec, label: label };
}

var V1 = vector3d(v1, '#2980b9', '\\(\\vec{v}_1\\)');
var V2 = vector3d(v2, '#27ae60', '\\(\\vec{v}_2\\)');

// Toggles for v3 (not coplanar) and w3 (coplanar), placed in the top margin
var showW3 = board.create('checkbox', [-5.5, 3.5, 'Show \\(\\vec{w}\\)'], { checked: false });
var showV3 = board.create('checkbox', [0.5, 3.5, 'Show \\(\\vec{v}_3\\)'], { checked: false });

var V3 = vector3d(v3, '#8e44ad', '\\(\\vec{v}_3\\)', function () { return showV3.Value(); });
var W3 = vector3d(w3, '#e67e22', '\\(\\vec{w}\\)', function () { return showW3.Value(); });

// Top banner listing the currently visible vectors and their components.
// Sits at y=5.6, inside the 2-unit top margin -- clear of the y=6 border.
board.create('text', [0.25, 4.6, function () {
    var parts = [
        '{\\color{blue}\\vec{v}_1=(2,2,0)}',
        '{\\color{green}\\vec{v}_2=(1,1,-1)}'
    ];
    if (showV3.Value()) parts.push('{\\color{purple}\\vec{v}_3=(-1,0,1)}');
    if (showW3.Value()) parts.push('{\\color{orange}\\vec{w}=(-5,-5,1)}');
    return '\\(' + parts.join('\\;\\;\\;') + '\\)';
}], {
    fixed: true,
    highlight: false,
    color: '#000000',
    fontSize: 15,
    useMathJax: true,
    anchorX: 'middle',
    anchorY: 'middle',
    cssStyle: 'background-color: rgba(255,255,255,0.85); padding: 3px 8px;'
});
