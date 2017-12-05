const Animator = require('./animator');
const Vector = require('./vector');
const GraphRenderer = require('./graph-renderer');
const Button = require('./button');

const template = `
<canvas width="256" height="256"></canvas>
<div>
Rotate:
<button class="rot-xy">x-y</button>
<button class="rot-yz">y-z</button>
<button class="rot-xz">x-z</button>
</div>
`;

function CubeSpinner(node) {

    var points = Vector.cube(0.5);

    node.innerHTML = template;

    var canvas = node.querySelector('canvas');

    // indices of axes to rotate
    var rotation = [0, 1];

    var core = {

        graphRenderer: GraphRenderer(canvas, {
            xmin: -2, xmax: 2,
            ymin: -2, ymax: 2,
        }),

        animator: Animator(() => {
            points = points.map(point => Vector.rotate(point, rotation[0], rotation[1], 0.03));
            core.graphRenderer.render(points, ['red', 'green', 'blue', 'black']);
        }),

        xyRotateButton: Button(node.querySelector('.rot-xy'), event => {
            rotation = [0, 1];
        }),
        yzRotateButton: Button(node.querySelector('.rot-yz'), event => {
            rotation = [1, 2];
        }),
        xzRotateButton: Button(node.querySelector('.rot-xz'), event => {
            rotation = [0, 2];
        }),

    };

    core.animator.start();

    return {
        done() {
            for (let sub of core) {
                sub.done();
            }
        }
    }
}

module.exports = CubeSpinner;
