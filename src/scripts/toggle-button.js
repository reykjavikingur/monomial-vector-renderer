const Button = require('./button');

function ToggleButton(node, cb) {
    var mode = false;
    var button = Button(node, event => {
        mode = !mode;
        cb(mode);
    });
    return {
        set label(value) {
            node.innerText = value;
        },
        done() {
            button.done();
        }
    }
}

module.exports = ToggleButton;
