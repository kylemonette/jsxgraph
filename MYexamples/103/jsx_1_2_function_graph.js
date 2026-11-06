JXG.Options.text.useMathJax = true;

var board = JXG.JSXGraph.initBoard('jsx_1_2_function_graph_fig', {
    boundingbox: [-4, 4, 4, -4],
    axis: true,
    showCopyright: false
});

const fx = (x) => 0.4*x*x*x - 1.3*x*x + 1;

// var xptx = board.create('glider',[0,0,board.defaultAxes.x],{name: 'x', color: 'red', size: 3, fontSize: 16});
var xptx = board.create('glider',[-0.3,0,board.defaultAxes.x],{name: 'Drag Me', color: 'red', size: 3});
xptx.on('drag', () => {
xptx.name = '';
});


var f = board.create('functiongraph', [
    function (x) {
        return fx(x)
    }
]);

var yptx = board.create('point',
[function () {return xptx.X();}, function() {return fx(xptx.X())} ],
{name: '', color: 'red', size: 3});


var ytext = board.create('text',[0,0.3,'(x,f(x))'], {anchor: yptx, fixed: true, parse: false, fontSize: 16});
var xtext = board.create('text',[0,0.3,'x'], {anchor: xptx, fixed: true, parse: false, fontSize: 16});


var lineseg = board.create('segment', [xptx,yptx], {dash: 2, color: 'purple'});