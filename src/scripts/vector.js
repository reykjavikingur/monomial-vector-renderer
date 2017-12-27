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
    cube(r) {
        r *= Math.sqrt(3);
        var points = [];
        for (let x of [-r, r]) {
            for (let y of [-r, r]) {
                for (let z of [-r, r]) {
                    points.push([x, y, z]);
                }
            }
        }
        return points;
    },
    hypercube(n, r) {
        if (n == 1) {
            // base case
            return [[-r], [r]];
        }
        else {
            var subpoints = this.hypercube(n - 1, r);
            var points = [];
            for (let subpoint of subpoints) {
                var s1 = subpoint.slice();
                var s2 = subpoint.slice();
                s1.push(-r);
                s2.push(r);
                points.push(s1);
                points.push(s2);
            }
            return points;
        }
    },
    colorizer(source) {
        if (!source) {
            return (vector, index) => {
                var z = vector[2] || 0;
                var w = vector[3] || 0;
                var angle = Math.atan2(w, z);
                if (angle < 0) {
                    angle += 2 * Math.PI;
                }
                var max = 2;
                var magFactor = max * Math.sqrt(vector.length);

                var mag = Math.sqrt(z * z + w * w);
                var hue = Math.round(angle * 180 / Math.PI);
                var sat = 100 + '%';
                var lum = Math.round(mag * 100 / magFactor) + '%';
                return `hsl(${hue}, ${sat}, ${lum})`;
            };
        }
        else if (Array.isArray(source)) {
            return (vector, index) => {
                return source[index % source.length];
            };
        }
        else if (typeof source === 'function') {
            return source;
        }
        else {
            throw new Error('invalid colorizer source');
        }
    },
};

module.exports = Vector;

