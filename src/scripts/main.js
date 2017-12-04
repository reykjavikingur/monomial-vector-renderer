console.log('starting main');

const PointRenderer = require('./point-renderer');
const GraphRenderer = require('./graph-renderer');
const Animator = require('./animator');
const Vector = require('./vector');

var mainEl = document.querySelector('main');

var template = `
<canvas class="graph-renderer" width="256" height="256"></canvas>
<canvas class="point-renderer" width="256" height="256"></canvas>
`;

mainEl.innerHTML = template;

var graphCanvas = mainEl.querySelector('canvas.graph-renderer');
var pointCanvas = mainEl.querySelector('canvas.point-renderer');
var options = {
    xmin: -2, xmax: 2,
    ymin: -2, ymax: 2,
};
var graphRenderer = GraphRenderer(graphCanvas, options);
var pointRenderer = PointRenderer(pointCanvas, options);

var points = Vector.polygon(6, 1);

var animator = Animator(() => {
    for (let i in points) {
        points[i] = Vector.rotate(points[i], 0, 1, 0.03);
    }
    graphRenderer.render(points);
    pointRenderer.render(points);
});

animator.start();
