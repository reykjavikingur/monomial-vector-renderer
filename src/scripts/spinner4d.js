const Vector = require('./vector');
const Animator = require('./animator');
const GraphRenderer = require('./graph-renderer');
const PointRenderer = require('./point-renderer');
const MultiButton = require('./multi-button');
const MultiPresser = require('./multi-presser');

const ROTATION_SPEED = 0.01;

const template = `
<canvas width="256" height="256" class="graph-renderer"></canvas>
<canvas width="256" height="256" class="point-renderer"></canvas>
<input type="button" value="x-y" class="axis"/>
<input type="button" value="y-z" class="axis"/>
<input type="button" value="x-z" class="axis"/>
<input type="button" value="x-w" class="axis"/>
<input type="button" value="y-w" class="axis"/>
<input type="button" value="z-w" class="axis"/>
<input type="button" value="-" class="speed"/>
<input type="button" value="+" class="speed"/>
`;

function Spinner4d(node) {

    // vectors to render
    var points = Vector.hypercube(4, 1);

    // indices of axes to rotate
    var rotation;

    var rotationSpeed = 0;

    node.innerHTML = template;

    var rendererOptions = {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2,
    };
    var graphRenderer = GraphRenderer(node.querySelector('canvas.graph-renderer'), rendererOptions);
    var pointRenderer = PointRenderer(node.querySelector('canvas.point-renderer'), rendererOptions);

    var animator = Animator(() => {
        var colors = ['black', 'red', 'green', 'blue', 'orange'];
        points = points.map(point => Vector.rotate(point, rotation[0], rotation[1], rotationSpeed));
        graphRenderer.render(points, colors);
        pointRenderer.render(points, colors);
    });

    var axisMultiButton = MultiButton(node.querySelectorAll('input[type="button"].axis'), value => {
        var parts = String(value).split('-');
        var axes = ['x', 'y', 'z', 'w'];
        var axis1 = axes.indexOf(parts[0]);
        var axis2 = axes.indexOf(parts[1]);
        rotation = [axis1, axis2];
    });
    axisMultiButton.value = 'x-y'; // initialize to default axis

    var speedMultiButton = MultiPresser(node.querySelectorAll('input[type="button"].speed'), target => {
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
            graphRenderer.done();
            pointRenderer.done();
            animator.done();
            axisMultiButton.done();
            speedMultiButton.done();
        }
    };
}

module.exports = Spinner4d;