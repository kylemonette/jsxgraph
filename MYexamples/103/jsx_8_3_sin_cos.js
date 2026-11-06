JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard('jsx_8_3_sin_cos_fig', {
    boundingbox: [-1.7, 1.7, 1.7, -1.7],
    axis: false,
    grid: false,
    showNavigation: true,
    showCopyright: false
});

// Custom x-axis with ticks only at -1 and 1
var xaxis = board.create('axis', [[0, 0], [1, 0]], {
    ticks: {
        ticksDistance: 1,
        minorTicks: 0,
        drawZero: false,
        insertTicks: false
    }
});

// Custom y-axis with ticks only at -1 and 1
var yaxis = board.create('axis', [[0, 0], [0, 1]], {
    ticks: {
        ticksDistance: 1,
        minorTicks: 0,
        drawZero: false,
        insertTicks: false
    }
});

// The unit circle, centered at the origin
var origin = board.create('point', [0, 0], {
    name: '',
    fixed: true,
    size: 2,
    color: 'black'
});

var circle = board.create('circle', [origin, 1], {
    strokeColor: 'blue',
    strokeWidth: 1,
    fixed: true
});

// Point P dragging along the circle (label suppressed here, drawn separately below)
var P = board.create('glider', [0.7, 0.7, circle], {
    name: '',
    color: 'black',
    size: 3,
    showInfobox: false
});

// Foot of the perpendicular on the x-axis, directly under P
var foot = board.create('point', [
    function () { return P.X(); },
    0
], {
    name: '',
    visible: false,
    fixed: true
});

// Blue line: origin -> (x, 0)  (the cosine leg, adjacent side)
var adjacentLine = board.create('segment', [origin, foot], {
    strokeColor: 'blue',
    strokeWidth: 3
});

// Red line: (x, 0) -> P  (the sine leg, opposite side)
var oppositeLine = board.create('segment', [foot, P], {
    strokeColor: 'red',
    strokeWidth: 3
});

// Black line: P -> origin  (the hypotenuse, radius = 1)
var hypotenuseLine = board.create('segment', [P, origin], {
    strokeColor: 'black',
    strokeWidth: 2
});

// Label for cos(theta), centered horizontally on the blue line
var cosLabel = board.create('text', [
    function () { return origin.X() + (foot.X() - origin.X()) / 2; },
    function () { return -0.12 * (foot.X() >= origin.X() ? 1 : -1); },
    '\\( \\cos\\theta \\)'
], {
    fontSize: 14,
    color: 'blue',
    anchorX: 'middle',
    anchorY: 'middle',
    fixed: true,
    parse: false,
    useMathJax: true
});

// Label for sin(theta), placed along the red line, offset to the side
var sinLabel = board.create('text', [
    function () { return foot.X() + 0.19 * (P.X() >= 0 ? 1 : -1); },
    function () { return foot.Y() + (P.Y() - foot.Y()) / 2; },
    '\\( \\sin\\theta \\)'
], {
    fontSize: 14,
    color: 'red',
    anchorX: 'middle',
    anchorY: 'middle',
    fixed: true,
    parse: false,
    useMathJax: true
});

// Format a coordinate to 2 decimal places
const fmt2 = function (v) {
    return v.toFixed(2);
};

// Label showing P's coordinates, pushed radially outward so it always sits outside the circle no matter where P is dragged
var pLabelOffset = 0.27; // distance beyond the circle's radius
var pLabel = board.create('text', [
    function () { return P.X() * (1 + pLabelOffset); },
    function () { return P.Y() * (1 + pLabelOffset); },
    function () { return `\\( P = (${fmt2(P.X())}, ${fmt2(P.Y())}) \\)`; }
], {
    fontSize: 13,
    color: 'black',
    anchorX: 'middle',
    anchorY: 'middle',
    fixed: true,
    parse: false,
    useMathJax: true
});