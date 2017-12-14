const Vector = require('./vector');
const Animator = require('./animator');
const GraphRenderer = require('./graph-renderer');
const MultiButton = require('./multi-button');
const MultiPresser = require('./multi-presser');

const ROTATION_SPEED = 0.01;

const template = `
<canvas width="256" height="256"></canvas>
<input type="button" value="x" class="axis"/>
<input type="button" value="y" class="axis"/>
<input type="button" value="z" class="axis"/>
<input type="button" value="-" class="speed"/>
<input type="button" value="+" class="speed"/>
`;

function Spinner3d(node) {

    // vectors to render
    var points = Vector.cube(0.5);

    // indices of axes to rotate
    var rotation;

    var rotationSpeed = 0;

    node.innerHTML = template;

    var graphRenderer = GraphRenderer(node.querySelector('canvas'), {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2,
    });

    var animator = Animator(() => {
        points = points.map(point => Vector.rotate(point, rotation[0], rotation[1], rotationSpeed));
        graphRenderer.render(points, ['red', 'green', 'blue', 'black']);
    });

    var axisMultiButton = MultiButton(node.querySelectorAll('input[type="button"].axis'), value => {
        switch(value) {
            case 'x':
                rotation = [1, 2];
                break;
            case 'y':
                rotation = [0, 2];
                break;
            case 'z':
                rotation = [0, 1];
                break;
            default:
                break;
        }
    });
    axisMultiButton.value = 'x';

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
        done(){
            graphRenderer.done();
            animator.done();
            axisMultiButton.done();
            speedMultiButton.done();
        }
    }
}

module.exports = Spinner3d;
