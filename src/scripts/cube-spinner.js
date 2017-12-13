const Animator = require('./animator');
const Vector = require('./vector');
const GraphRenderer = require('./graph-renderer');
const Button = require('./button');

const template = `
<canvas width="256" height="256"></canvas>
`;

function CubeSpinner(node, options) {

    if (!options) {
        options = {};
    }

    var points = Vector.cube(0.5);

    node.innerHTML = template;

    var canvas = node.querySelector('canvas');

    // indices of axes to rotate
    var rotation = options.rotation || [0, 1];

    var core = {

        graphRenderer: GraphRenderer(canvas, {
            xmin: -2, xmax: 2,
            ymin: -2, ymax: 2,
        }),

        animator: Animator(() => {
            points = points.map(point => Vector.rotate(point, rotation[0], rotation[1], 0.03));
            core.graphRenderer.render(points, ['red', 'green', 'blue', 'black']);
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
