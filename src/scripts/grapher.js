
function Grapher(canvas, options) {
    var context = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var xmin = options.xmin;
    var xmax = options.xmax;
    var ymin = options.ymin;
    var ymax = options.ymax;
    var xrange = xmax - xmin;
    var yrange = ymax - ymin;
    var xmid = Math.round(Math.abs(xmin / xrange) * w);
    var ymid = Math.round(Math.abs(ymin / yrange) * h);
    var xscale = w / xrange;
    var yscale = h / yrange;
    var pw = xrange / w;
    clear();
    function clear() {
        context.save();
        context.fillStyle = options.backgroundColor;
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
            context.translate(xmid, ymid);
            context.scale(xscale, -yscale);
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
