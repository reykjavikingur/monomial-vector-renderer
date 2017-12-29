const PointRenderer = require('./point-renderer');
const GraphRenderer = require('./graph-renderer');
const Animator = require('./animator');
const Vector = require('./vector');
const MultiPresser = require('./multi-presser');

const ROTATION_SPEED = 0.01;

const template = `
<canvas class="graph-renderer" width="256" height="256"></canvas>
<canvas class="point-renderer" width="256" height="256"></canvas>
<input type="button" value="-" class="speed"/>
<input type="button" value="+" class="speed"/>
`;

function PolygonSpinner(node, options) {

    var mainEl = node;

    node.innerHTML = template;

    var graphCanvas = node.querySelector('canvas.graph-renderer');
    var pointCanvas = node.querySelector('canvas.point-renderer');
    var options = {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2,
    };
    var graphRenderer = GraphRenderer(graphCanvas, options);
    var pointRenderer = PointRenderer(pointCanvas, options);

    var points = Vector.polygon(6, 1);

    var rotationSpeed = 0;

    var animator = Animator(() => {
        var colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
        graphRenderer.render(points, colors);
        pointRenderer.render(points, colors);
        for (let i in points) {
            points[i] = Vector.rotate(points[i], 0, 1, rotationSpeed);
        }
    });

    var multiPresser = MultiPresser(node.querySelectorAll('input[type="button"].speed'), target => {
        if (target) {
            switch (target.value) {
                case '-':
                    rotationSpeed = -ROTATION_SPEED;
                    break;
                case '+':
                    rotationSpeed = ROTATION_SPEED;
                    break;
                default:
                    break;
            }
            animator.start();
        }
        else {
            rotationSpeed = 0;
            animator.stop();
        }
    });

    animator.step();

    return {
        done() {
            animator.done();
            graphRenderer.done();
            pointRenderer.done();
            multiPresser.done();
        },
    };

}

module.exports = PolygonSpinner;
