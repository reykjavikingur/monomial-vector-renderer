function Interval(options) {
    var xmin = options.xmin;
    var xmax = options.xmax;
    var ymin = options.ymin;
    var ymax = options.ymax;
    var xrange = xmax - xmin;
    var yrange = ymax - ymin;

    return {
        xmin: xmin,
        xmax: xmax,
        ymin: ymin,
        ymax: ymax,
        getPixelWidth(context) {
            var w = context.canvas.width;
            return xrange / w;
        },
        getPixelPosition(context, x, y) {
            var w = context.canvas.width;
            var h = context.canvas.height;
            var xscale = w / xrange;
            var yscale = h / yrange;
            var xmid = Math.round(Math.abs(xmin / xrange) * w);
            var ymid = Math.round(Math.abs(ymin / yrange) * h);
            return [
                x * xscale + xmid,
                y * yscale + ymid,
            ];
        },
        adjustCanvasContext(context) {
            var w = context.canvas.width;
            var h = context.canvas.height;
            var xscale = w / xrange;
            var yscale = h / yrange;
            var xmid = Math.round(Math.abs(xmin / xrange) * w);
            var ymid = Math.round(Math.abs(ymin / yrange) * h);
            context.translate(xmid, ymid);
            context.scale(xscale, -yscale);
        },
    };
}

module.exports = Interval;
