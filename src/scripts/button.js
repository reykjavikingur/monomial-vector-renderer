const Listener = require('./listener');

function Button(node, cb) {
    var listener = Listener(node, 'click', event => {
        cb(event);
    });
    return {
        done() {
            listener.done();
        }
    }
}

module.exports = Button;
