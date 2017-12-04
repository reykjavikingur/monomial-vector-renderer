const Interval = require('./interval');

function PointRenderer(canvas, options) {
    var context = canvas.getContext('2d');
    var interval = Interval({
        xmin: options.xmin, xmax: options.xmax,
        ymin: options.ymin, ymax: options.ymax,
    });
    clear();
    return {
        render(points) {
            clear();
            for (let point of points) {
                var x = point[0];
                var y = point[1];
                var canvasPoint = interval.getPixelPosition(context, x, y);
                var cx = canvasPoint[0];
                var cy = canvasPoint[1];
                context.save();
                context.strokeStyle = 'black';
                context.strokeRect(cx, cy, 1, 1);
                context.restore();
            }
        },
        done() {

        }
    };

    function clear() {
        context.save();
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}

module.exports = PointRenderer;
