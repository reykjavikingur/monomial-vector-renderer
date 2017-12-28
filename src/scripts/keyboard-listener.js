const Listener = require('./listener');

const KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
};

function KeyboardListener(node, actions) {
    if (!actions) {
        actions = {};
    }
    var pressed = {};
    var keydownListener = Listener(node, 'keydown', event => {
        pressed[event.keyCode] = true;
    });
    var keyupListener = Listener(node, 'keyup', event => {
        pressed[event.keyCode] = false;
    });
    return {
        isPressed(code) {
            return Boolean(pressed[code]);
        },
        performActions() {
            for (let key in actions) {
                let action = actions[key];
                if (typeof action === 'function' && this.isPressed(KEYS[key])) {
                    action();
                }
            }
        },
        done() {
            keydownListener.done();
            keyupListener.done();
        }
    }
}

module.exports = KeyboardListener;
