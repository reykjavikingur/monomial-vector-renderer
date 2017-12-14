const Button = require('./button');
const PointRenderer = require('./point-renderer');
const GraphRenderer = require('./graph-renderer');
const Animator = require('./animator');
const Vector = require('./vector');

const template = `
<canvas class="graph-renderer" width="256" height="256"></canvas>
<canvas class="point-renderer" width="256" height="256"></canvas>
<button class="play-button">play</button>
<button class="stop-button">stop</button>
`;

function PolygonSpinner(node, options) {

    var mainEl = node;

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
        graphRenderer.render(points);
        pointRenderer.render(points);
        for (let i in points) {
            points[i] = Vector.rotate(points[i], 0, 1, 0.03);
        }
    });

    var playButton = Button(mainEl.querySelector('.play-button'), event => {
        animator.start();
    });
    var stopButton = Button(mainEl.querySelector('.stop-button'), event => {
        animator.stop();
    });

    animator.step();

    return {
        done() {
            animator.done();
            graphRenderer.done();
            pointRenderer.done();
            playButton.done();
        },
    };

}

module.exports = PolygonSpinner;
