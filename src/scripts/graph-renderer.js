const Grapher = require('./grapher');
const Monomial = require('./monomial');

function GraphRenderer(canvas, options) {
    var grapher = Grapher(canvas, {
        xmin: options.xmin, xmax: options.xmax,
        ymin: options.ymin, ymax: options.ymax,
    });
    return {
        render(vectors, colors) {
            if (!colors) {
                colors = ['black'];
            }
            var monomials = vectors.map(vector => Monomial.create(vector));
            grapher.clear();
            for (let i in monomials) {
                let monomial = monomials[i];
                let color = colors[i % colors.length];
                grapher.graph(color, monomial);
            }
        },
        done() {
            grapher.done();
        },
    };
}

module.exports = GraphRenderer;
