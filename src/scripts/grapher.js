const Interval = require('./interval');

function Grapher(canvas, options) {
    var context = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    var interval = Interval({
        xmin: options.xmin,
        xmax: options.xmax,
        ymin: options.ymin,
        ymax: options.ymax,
    });

    clear();

    function clear() {
        context.save();
        context.fillStyle = options.backgroundColor || 'white';
        context.fillRect(0, 0, w, h);
        context.restore();
    }

    return {
        clear() {
            clear();
        },
        graph(color, fn) {
            context.save();
            context.save();
            var pw = interval.getPixelWidth(context);
            var xmin = interval.xmin;
            var xmax = interval.xmax;
            interval.adjustCanvasContext(context);
            context.beginPath();
            context.moveTo(xmin, fn(xmin));
            for (let x = xmin + pw; x <= xmax; x += pw) {
                context.lineTo(x, fn(x));
            }
            context.restore();
            context.lineJoin = 'round';
            context.lineWidth = 2;
            context.strokeStyle = color;
            context.stroke();
            context.restore();
        },
        done() {

        }
    }
}

module.exports = Grapher;
