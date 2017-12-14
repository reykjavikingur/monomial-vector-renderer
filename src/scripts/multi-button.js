const Listener = require('./listener');

function MultiButton(nodes, cb) {
    var buttons = [];
    for (let node of nodes) {
        let button = Listener(node, 'click', event => {
            setValue(event.target.value);
        });
        buttons.push(button);
    }
    return {
        set value(v) {
            setValue(v);
        },
        done() {
            for (let button of buttons) {
                button.done();
            }
        }
    };
    function setValue(value) {
        for (let node of nodes) {
            node.disabled = node.value === value;
        }
        cb(value);
    }
}

module.exports = MultiButton;
