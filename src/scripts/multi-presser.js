const Listener = require('./listener');

function MultiPresser(nodes, cb){
    var ups = [];
    var dns = [];
    for (let node of nodes) {
        let dn = Listener(node, 'mousedown', event => {
            cb(event.target);
        });
        dns.push(dn);
        let up = Listener(node, 'mouseup', event => {
            cb(null);
        });
        ups.push(up);
    }
    return {
        done() {
            for (let dn of dns) {
                dn.done();
            }
            for (let up of ups) {
                up.done();
            }
        },
    };
}

module.exports = MultiPresser;
