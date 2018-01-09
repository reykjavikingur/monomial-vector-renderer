(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function Animator(fn) {
    var goingToStep = false,
        running = false;
    function animate() {
        if (goingToStep || running) {
            fn();
            goingToStep = false;
        }
        window.requestAnimationFrame(animate);
    }
    animate();
    return {
        start: function start() {
            running = true;
        },
        stop: function stop() {
            running = false;
        },
        step: function step() {
            goingToStep = true;
        },
        done: function done() {
            goingToStep = false;
            running = false;
        }
    };
}

module.exports = Animator;

},{}],2:[function(require,module,exports){
'use strict';

var Grapher = require('./grapher');
var Monomial = require('./monomial');

function GraphRenderer(canvas, options) {
    var grapher = Grapher(canvas, {
        xmin: options.xmin, xmax: options.xmax,
        ymin: options.ymin, ymax: options.ymax
    });
    return {
        render: function render(vectors, colors) {
            if (!colors) {
                colors = ['black'];
            }
            var monomials = vectors.map(function (vector) {
                return Monomial.create(vector);
            });
            grapher.clear();
            for (var i in monomials) {
                var monomial = monomials[i];
                var color = colors[i % colors.length];
                grapher.graph(color, monomial);
            }
        },

        get xmin() {
            return options.xmin;
        },
        get ymin() {
            return options.ymin;
        },
        get xmax() {
            return options.xmax;
        },
        get ymax() {
            return options.ymax;
        },
        done: function done() {
            grapher.done();
        }
    };
}

module.exports = GraphRenderer;

},{"./grapher":3,"./monomial":7}],3:[function(require,module,exports){
'use strict';

var Interval = require('./interval');

function Grapher(canvas, options) {
    var context = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    var interval = Interval({
        xmin: options.xmin,
        xmax: options.xmax,
        ymin: options.ymin,
        ymax: options.ymax
    });

    _clear();

    function _clear() {
        context.save();
        context.fillStyle = options.backgroundColor || 'white';
        context.fillRect(0, 0, w, h);
        context.restore();
    }

    return {
        clear: function clear() {
            _clear();
        },
        graph: function graph(color, fn) {
            context.save();
            context.save();
            var pw = interval.getPixelWidth(context);
            var xmin = interval.xmin;
            var xmax = interval.xmax;
            interval.adjustCanvasContext(context);
            context.beginPath();
            context.moveTo(xmin, fn(xmin));
            for (var x = xmin + pw; x <= xmax; x += pw) {
                context.lineTo(x, fn(x));
            }
            context.restore();
            context.lineJoin = 'round';
            context.lineWidth = 2;
            context.strokeStyle = color;
            context.stroke();
            context.restore();
        },
        done: function done() {}
    };
}

module.exports = Grapher;

},{"./interval":4}],4:[function(require,module,exports){
"use strict";

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
        getPixelWidth: function getPixelWidth(context) {
            var w = context.canvas.width;
            return xrange / w;
        },
        getPixelPosition: function getPixelPosition(context, x, y) {
            var w = context.canvas.width;
            var h = context.canvas.height;
            var xscale = w / xrange;
            var yscale = h / yrange;
            var xmid = Math.round(Math.abs(xmin / xrange) * w);
            var ymid = Math.round(Math.abs(ymin / yrange) * h);
            return [x * xscale + xmid, y * yscale + ymid];
        },
        adjustCanvasContext: function adjustCanvasContext(context) {
            var w = context.canvas.width;
            var h = context.canvas.height;
            var xscale = w / xrange;
            var yscale = h / yrange;
            var xmid = Math.round(Math.abs(xmin / xrange) * w);
            var ymid = Math.round(Math.abs(ymin / yrange) * h);
            context.translate(xmid, ymid);
            context.scale(xscale, -yscale);
        }
    };
}

module.exports = Interval;

},{}],5:[function(require,module,exports){
"use strict";

function Listener(target, type, cb) {
    target.addEventListener(type, cb);
    return {
        done: function done() {
            target.removeEventListener(type, cb);
        }
    };
}

module.exports = Listener;

},{}],6:[function(require,module,exports){
'use strict';

console.log('starting main');

var Vector = require('./vector');
var PolygonSpinner = require('./polygon-spinner');
var Spinner3d = require('./spinner3d');
var Spinner4d = require('./spinner4d');

var template = '\n\n<h2>2d spinner</h2>\n<div class="container2"></div>\n\n<h2>3d spinner</h2>\n<div class="container3"></div>\n\n<h2>4d spinner</h2>\n<div class="container4"></div>\n';

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

PolygonSpinner(mainEl.querySelector('.container2'));

Spinner3d(mainEl.querySelector('.container3'), {
    points: Vector.cube(0.5)
});

Spinner4d(mainEl.querySelector('.container4'), {
    points: Vector.hypercube(4, 1)
});

},{"./polygon-spinner":11,"./spinner3d":12,"./spinner4d":13,"./vector":14}],7:[function(require,module,exports){
"use strict";

var Monomial = {
    create: function create(coefficients) {
        return function (x) {
            var sum = 0;
            for (var n in coefficients) {
                var c = coefficients[n];
                var xn = Math.pow(x, n);
                sum += c * xn;
            }
            return sum;
        };
    }
};

module.exports = Monomial;

},{}],8:[function(require,module,exports){
'use strict';

var Listener = require('./listener');

function MultiButton(nodes, cb) {
    var buttons = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            var button = Listener(node, 'click', function (event) {
                setValue(event.target.value);
            });
            buttons.push(button);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return {
        set value(v) {
            setValue(v);
        },
        done: function done() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = buttons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var button = _step2.value;

                    button.done();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    };
    function setValue(value) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _node = _step3.value;

                _node.disabled = _node.value === value;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        cb(value);
    }
}

module.exports = MultiButton;

},{"./listener":5}],9:[function(require,module,exports){
'use strict';

var Listener = require('./listener');

function MultiPresser(nodes, cb) {
    var ups = [];
    var dns = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            var dn = Listener(node, 'mousedown', function (event) {
                cb(event.target);
            });
            dns.push(dn);
            var up = Listener(node, 'mouseup', function (event) {
                cb(null);
            });
            ups.push(up);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return {
        done: function done() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = dns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var dn = _step2.value;

                    dn.done();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = ups[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var up = _step3.value;

                    up.done();
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    };
}

module.exports = MultiPresser;

},{"./listener":5}],10:[function(require,module,exports){
'use strict';

var Vector = require('./vector');
var Interval = require('./interval');

function PointRenderer(canvas, options) {
    var context = canvas.getContext('2d');
    var interval = Interval({
        xmin: options.xmin, xmax: options.xmax,
        ymin: options.ymin, ymax: options.ymax
    });
    clear();
    return {
        render: function render(points, colors) {
            var colorize = Vector.colorizer(colors);
            if (!colors) {
                colors = ['black'];
            }
            clear();
            for (var i in points) {
                var color = colorize(points[i], i);
                colors[i % colors.length];
                var point = points[i];
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
        done: function done() {}
    };

    function clear() {
        context.save();
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}

module.exports = PointRenderer;

},{"./interval":4,"./vector":14}],11:[function(require,module,exports){
'use strict';

var PointRenderer = require('./point-renderer');
var GraphRenderer = require('./graph-renderer');
var Animator = require('./animator');
var Vector = require('./vector');
var MultiPresser = require('./multi-presser');

var ROTATION_SPEED = 0.01;

var template = '\n<canvas class="graph-renderer" width="256" height="256"></canvas>\n<canvas class="point-renderer" width="256" height="256"></canvas>\n<input type="button" value="-" class="speed"/>\n<input type="button" value="+" class="speed"/>\n';

function PolygonSpinner(node, options) {

    var mainEl = node;

    node.innerHTML = template;

    var graphCanvas = node.querySelector('canvas.graph-renderer');
    var pointCanvas = node.querySelector('canvas.point-renderer');
    var options = {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2
    };
    var graphRenderer = GraphRenderer(graphCanvas, options);
    var pointRenderer = PointRenderer(pointCanvas, options);

    var points = Vector.polygon(6, 1);

    var rotationSpeed = 0;

    var animator = Animator(function () {
        var colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
        graphRenderer.render(points, colors);
        pointRenderer.render(points, colors);
        for (var i in points) {
            points[i] = Vector.rotate(points[i], 0, 1, rotationSpeed);
        }
    });

    var multiPresser = MultiPresser(node.querySelectorAll('input[type="button"].speed'), function (target) {
        if (target) {
            switch (target.value) {
                case '-':
                    rotationSpeed = -ROTATION_SPEED;
                    break;
                case '+':
                    rotationSpeed = ROTATION_SPEED;
                    break;
                default:
                    break;
            }
            animator.start();
        } else {
            rotationSpeed = 0;
            animator.stop();
        }
    });

    animator.step();

    return {
        done: function done() {
            animator.done();
            graphRenderer.done();
            pointRenderer.done();
            multiPresser.done();
        }
    };
}

module.exports = PolygonSpinner;

},{"./animator":1,"./graph-renderer":2,"./multi-presser":9,"./point-renderer":10,"./vector":14}],12:[function(require,module,exports){
'use strict';

var Vector = require('./vector');
var Animator = require('./animator');
var GraphRenderer = require('./graph-renderer');
var PointRenderer = require('./point-renderer');
var MultiButton = require('./multi-button');
var MultiPresser = require('./multi-presser');

var ROTATION_SPEED = 0.01;

var template = '\n<canvas width="256" height="256" class="graph-renderer"></canvas>\n<canvas width="256" height="256" class="point-renderer"></canvas>\n<input type="button" value="x-y" class="axis"/>\n<input type="button" value="y-z" class="axis"/>\n<input type="button" value="x-z" class="axis"/>\n<input type="button" value="-" class="speed"/>\n<input type="button" value="+" class="speed"/>\n';

function Spinner3d(node, options) {

    if (!options) {
        options = {};
    }

    // vectors to render
    var points = options.points || [];

    // indices of axes to rotate
    var rotation;

    var rotationSpeed = 0;

    node.innerHTML = template;

    var rendererOptions = {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2
    };
    var graphRenderer = GraphRenderer(node.querySelector('canvas.graph-renderer'), rendererOptions);
    var pointRenderer = PointRenderer(node.querySelector('canvas.point-renderer'), rendererOptions);

    var animator = Animator(function () {
        points = points.map(function (point) {
            return Vector.rotate(point, rotation[0], rotation[1], rotationSpeed);
        });
        graphRenderer.render(points);
        pointRenderer.render(points, function (point, index) {
            // z => c : 2 => 255, -2 => 0
            var z = point[2];
            var c = 63 * z + 127;
            c = Math.max(0, Math.min(255, Math.round(c)));
            return 'rgb(' + c + ', ' + c + ', ' + c + ')';
        });
    });

    var axisMultiButton = MultiButton(node.querySelectorAll('input[type="button"].axis'), function (value) {
        var parts = String(value).split('-');
        var axes = ['x', 'y', 'z'];
        var axis1 = axes.indexOf(parts[0]);
        var axis2 = axes.indexOf(parts[1]);
        rotation = [axis1, axis2];
    });
    axisMultiButton.value = 'x-y'; // initialize to default axis

    var speedMultiButton = MultiPresser(node.querySelectorAll('input[type="button"].speed'), function (target) {
        if (target) {
            switch (target.value) {
                case '-':
                    rotationSpeed = -ROTATION_SPEED;
                    break;
                case '+':
                    rotationSpeed = ROTATION_SPEED;
                    break;
                default:
                    break;
            }
            animator.start();
        } else {
            rotationSpeed = 0;
            animator.stop();
        }
    });

    animator.step();

    return {
        done: function done() {
            graphRenderer.done();
            pointRenderer.done();
            animator.done();
            axisMultiButton.done();
            speedMultiButton.done();
        }
    };
}

module.exports = Spinner3d;

},{"./animator":1,"./graph-renderer":2,"./multi-button":8,"./multi-presser":9,"./point-renderer":10,"./vector":14}],13:[function(require,module,exports){
'use strict';

var Vector = require('./vector');
var Animator = require('./animator');
var GraphRenderer = require('./graph-renderer');
var PointRenderer = require('./point-renderer');
var MultiButton = require('./multi-button');
var MultiPresser = require('./multi-presser');

var ROTATION_SPEED = 0.01;

var template = '\n<canvas width="256" height="256" class="graph-renderer"></canvas>\n<canvas width="256" height="256" class="point-renderer"></canvas>\n<input type="button" value="x-y" class="axis"/>\n<input type="button" value="y-z" class="axis"/>\n<input type="button" value="x-z" class="axis"/>\n<input type="button" value="x-w" class="axis"/>\n<input type="button" value="y-w" class="axis"/>\n<input type="button" value="z-w" class="axis"/>\n<input type="button" value="-" class="speed"/>\n<input type="button" value="+" class="speed"/>\n';

function Spinner4d(node, options) {

    if (!options) {
        options = {};
    }

    // vectors to render
    var points = options.points || [];
    for (var i in points) {
        while (points[i].length < 4) {
            points[i].push(0);
        }
    }

    // indices of axes to rotate
    var rotation;

    var rotationSpeed = 0;

    node.innerHTML = template;

    var rendererOptions = {
        xmin: -2, xmax: 2,
        ymin: -2, ymax: 2
    };
    var graphRenderer = GraphRenderer(node.querySelector('canvas.graph-renderer'), rendererOptions);
    var pointRenderer = PointRenderer(node.querySelector('canvas.point-renderer'), rendererOptions);

    var animator = Animator(function () {
        points = points.map(function (point) {
            return Vector.rotate(point, rotation[0], rotation[1], rotationSpeed);
        });
        graphRenderer.render(points);
        pointRenderer.render(points, function (point, index) {
            var z = point[2];
            var w = point[3];
            var lum = 0.25 * z + 0.5;
            var sat = 0.25 * w + 0.5;
            lum = Math.max(0, Math.min(100, Math.round(lum * 100)));
            sat = Math.max(0, Math.min(100, Math.round(sat * 100)));
            return 'hsl(0, ' + sat + '%, ' + lum + '%)';
        });
    });

    var axisMultiButton = MultiButton(node.querySelectorAll('input[type="button"].axis'), function (value) {
        var parts = String(value).split('-');
        var axes = ['x', 'y', 'z', 'w'];
        var axis1 = axes.indexOf(parts[0]);
        var axis2 = axes.indexOf(parts[1]);
        rotation = [axis1, axis2];
    });
    axisMultiButton.value = 'x-y'; // initialize to default axis

    var speedMultiButton = MultiPresser(node.querySelectorAll('input[type="button"].speed'), function (target) {
        if (target) {
            switch (target.value) {
                case '-':
                    rotationSpeed = -ROTATION_SPEED;
                    break;
                case '+':
                    rotationSpeed = ROTATION_SPEED;
                    break;
                default:
                    break;
            }
            animator.start();
        } else {
            rotationSpeed = 0;
            animator.stop();
        }
    });

    animator.step();

    return {
        done: function done() {
            graphRenderer.done();
            pointRenderer.done();
            animator.done();
            axisMultiButton.done();
            speedMultiButton.done();
        }
    };
}

module.exports = Spinner4d;

},{"./animator":1,"./graph-renderer":2,"./multi-button":8,"./multi-presser":9,"./point-renderer":10,"./vector":14}],14:[function(require,module,exports){
'use strict';

var TAU = Math.PI * 2;

var Vector = {
    add: function add(a, b) {
        return a.map(function (ai, i) {
            return a[i] + b[i];
        });
    },
    scale: function scale(s, a) {
        return a.map(function (ai) {
            return s * ai;
        });
    },
    rotate: function rotate(a, u, v, angle) {
        //console.log('rotating by', angle);
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        //console.log('cos', cos);
        //console.log('sin', sin);
        var b = a.map(function (ai) {
            return ai;
        });
        //console.log('initially', b);
        b[u] = a[u] * cos - a[v] * sin;
        b[v] = a[u] * sin + a[v] * cos;
        return b;
    },
    polygon: function polygon(n, r) {
        // create regular polygon centered at origin with n points at radius r
        var points = [];
        for (var k = 0; k < n; k++) {
            var angle = TAU * k / n;
            var x = r * Math.cos(angle);
            var y = r * Math.sin(angle);
            points.push([x, y]);
        }
        return points;
    },
    cube: function cube(r) {
        r *= Math.sqrt(3);
        var points = [];
        var _arr = [-r, r];
        for (var _i = 0; _i < _arr.length; _i++) {
            var x = _arr[_i];var _arr2 = [-r, r];

            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                var y = _arr2[_i2];var _arr3 = [-r, r];

                for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
                    var z = _arr3[_i3];
                    points.push([x, y, z]);
                }
            }
        }
        return points;
    },
    hypercube: function hypercube(n, r) {
        if (n == 1) {
            // base case
            return [[-r], [r]];
        } else {
            var subpoints = this.hypercube(n - 1, r);
            var points = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = subpoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var subpoint = _step.value;

                    var s1 = subpoint.slice();
                    var s2 = subpoint.slice();
                    s1.push(-r);
                    s2.push(r);
                    points.push(s1);
                    points.push(s2);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return points;
        }
    },
    colorizer: function colorizer(source) {
        if (!source) {
            return function (vector, index) {
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
                return 'hsl(' + hue + ', ' + sat + ', ' + lum + ')';
            };
        } else if (Array.isArray(source)) {
            return function (vector, index) {
                return source[index % source.length];
            };
        } else if (typeof source === 'function') {
            return source;
        } else {
            throw new Error('invalid colorizer source');
        }
    }
};

module.exports = Vector;

},{}]},{},[6])

//# sourceMappingURL=main.js.map
