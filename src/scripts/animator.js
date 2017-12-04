function Animator(fn) {
    var goingToStep = false, running = false;
    function animate() {
        if (goingToStep || running) {
            fn();
            goingToStep = false;
        }
        window.requestAnimationFrame(animate);
    }
    animate();
    return {
        start() {
            running = true;
        },
        stop() {
            running = false;
        },
        step() {
            goingToStep = true;
        },
        done() {
            goingToStep = false;
            running = false;
        }
    }
}

module.exports = Animator;
