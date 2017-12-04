const Grapher = require('./grapher');
const Monomial = require('./monomial');

function GraphRenderer(canvas, options) {
    var grapher = Grapher(canvas, {
        xmin: options.xmin, xmax: options.xmax,
        ymin: options.ymin, ymax: options.ymax,
    });
    return {
        render(vectors) {
            var monomials = vectors.map(vector => Monomial.create(vector));
            grapher.clear();
            for (let monomial of monomials) {
                grapher.graph('black', monomial);
            }
        },
        done() {
            grapher.done();
        },
    };
}

module.exports = GraphRenderer;
