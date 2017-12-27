const Animator = require('./animator');
const GraphRenderer = require('./graph-renderer');
const PointRenderer = require('./point-renderer');
const MultiButton = require('./multi-button');
const MultiPresser = require('./multi-presser');

const template = `
<canvas width="256" height="256" class="graph-renderer"></canvas>
<canvas width="256" height="256" class="point-renderer"></canvas>
<input type="button" value="x" class="axis"/>
<input type="button" value="y" class="axis"/>
<input type="button" value="z" class="axis"/>
<input type="button" value="w" class="axis"/>
<input type="button" value="-" class="speed"/>
<input type="button" value="+" class="speed"/>
`;

const TRANSLATION_SPEED = 0.01;

function Translator(node) {

    if (!node) {
        console.error('node required for Translator');
        return;
    }

    var point = [0, 0, 0, 0];
    var selectedAxis = 0; // index of point component
    var selectedSpeed = 0;

    node.innerHTML = template;

    var rendererOptions = {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2,
    };
    var graphRenderer = GraphRenderer(node.querySelector('canvas.graph-renderer'), rendererOptions);
    var pointRenderer = PointRenderer(node.querySelector('canvas.point-renderer'), rendererOptions);

    var animator = Animator(() => {
        if (selectedAxis >= 0 && selectedAxis < point.length) {
            point[selectedAxis] += selectedSpeed;
        }
        graphRenderer.render([point]);
        pointRenderer.render([point]);
    });

    var axisMultiButton = MultiButton(node.querySelectorAll('.axis'), value => {
        var axes = ['x', 'y', 'z', 'w'];
        selectedAxis = axes.indexOf(value);
    });
    axisMultiButton.value = 'x'; // initialize

    var speedMultiPresser = MultiPresser(node.querySelectorAll('.speed'), target => {
        if (target) {
            switch (target.value) {
                case '+':
                    selectedSpeed = TRANSLATION_SPEED;
                    break;
                case '-':
                    selectedSpeed = -TRANSLATION_SPEED;
                    break;
                default:
                    console.error('invalid direction input');
                    break;
            }
            animator.start();
        }
        else {
            selectedSpeed = 0;
            animator.stop();
        }
    });

    animator.step();

    return {
        done(){
            graphRenderer.done();
            pointRenderer.done();
            axisMultiButton.done();
        }
    }
}

module.exports = Translator;
