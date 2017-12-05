const Listener = require('./listener');

function KeyboardListener() {
    var pressed = {};
    var keydownListener = Listener(window, 'keydown', event => {
        pressed[event.keyCode] = true;
    });
    var keyupListener = Listener(window, 'keyup', event => {
        pressed[event.keyCode] = false;
    });
    return {
        isPressed(code) {
            return Boolean(pressed[code]);
        },
        done() {
            keydownListener.done();
            keyupListener.done();
        }
    }
}

module.exports = KeyboardListener;
