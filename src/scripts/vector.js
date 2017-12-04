const TAU = Math.PI * 2;

const Vector = {
    add(a, b) {
        return a.map((ai, i) => a[i] + b[i]);
    },
    scale(s, a) {
        return a.map(ai => s * ai);
    },
    rotate(a, u, v, angle) {
        //console.log('rotating by', angle);
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        //console.log('cos', cos);
        //console.log('sin', sin);
        var b = a.map(ai => ai);
        //console.log('initially', b);
        b[u] = a[u] * cos - a[v] * sin;
        b[v] = a[u] * sin + a[v] * cos;
        return b;
    },
    polygon(n, r) {
        // create regular polygon centered at origin with n points at radius r
        var points = [];
        for (let k = 0; k < n; k++) {
            let angle = TAU * k / n;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            points.push([x, y]);
        }
        return points;
    },
};

module.exports = Vector;

