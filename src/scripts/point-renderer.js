const Vector = require('./vector');
const Interval = require('./interval');

function PointRenderer(canvas, options) {
    var context = canvas.getContext('2d');
    var interval = Interval({
        xmin: options.xmin, xmax: options.xmax,
        ymin: options.ymin, ymax: options.ymax,
    });
    clear();
    return {
        render(points, colors) {
            var colorize = Vector.colorizer(colors);
            if (!colors) {
                colors = ['black'];
            }
            clear();
            for (let i in points) {
                let color = colorize(points[i], i);
                colors[i % colors.length];
                let point = points[i];
                var x = point[0];
                var y = point[1];
                var canvasPoint = interval.getPixelPosition(context, x, y);
                var cx = canvasPoint[0];
                var cy = canvasPoint[1];
                context.save();
                context.strokeStyle = color;
                context.strokeRect(cx, cy, 2, 2);
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
