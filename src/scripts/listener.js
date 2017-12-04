function Listener(target, type, cb) {
    target.addEventListener(type, cb);
    return {
        done() {
            target.removeEventListener(type, cb);
        }
    }
}

module.exports = Listener;
