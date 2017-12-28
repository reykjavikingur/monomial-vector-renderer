const Dot = require('./dot');
const KeyboardListener = require('./keyboard-listener');

const SPEED = 0.01;

function PlayerDot(gameNode, vector, color) {
    var dot = Dot(vector, color);
    var keyboardListener = KeyboardListener(gameNode, {
        UP: () => move(0, SPEED),
        DOWN: () => move(0, -SPEED),
        LEFT: () => move(1, SPEED),
        RIGHT: () => move(1, -SPEED),
        W: () => move(2, SPEED),
        S: () => move(2, -SPEED),
        A: () => move(3, SPEED),
        D: () => move(3, -SPEED),
    });
    function move(axis, distance) {
        dot.vector[axis] += distance;
    }
    return {
        register(renderer) {
            dot.register(renderer);
        },
        render() {
            keyboardListener.performActions();
            dot.render();
        },
        done() {
            keyboardListener.done();
        }
    };
}

module.exports = PlayerDot;
