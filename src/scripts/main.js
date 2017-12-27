console.log('starting main');

const Vector = require('./vector');
const Translator = require('./translator');
const PolygonSpinner = require('./polygon-spinner');
const Spinner3d = require('./spinner3d');
const Spinner4d = require('./spinner4d');

const template = `
<h2>point representations</h2>
<div class="point"></div>

<h2>rotating hexagon</h2>
<div class="polygon-spinner"></div>

<h2>rotating cube</h2>
<p>representation of a cube shown rotating around each of x, y, z axes</p>
<span class="cube-spinner"></span>

<h2>rotating hypercube</h2>
<span class="hypercube-spinner"></span>

`;

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

var translator = Translator(mainEl.querySelector('.point'));

var spinningPolygon = PolygonSpinner(mainEl.querySelector('.polygon-spinner'));

var spinner3d = Spinner3d(mainEl.querySelector('.cube-spinner'), {
    points: Vector.hypercube(3, 1),
});

var spinner4d = Spinner4d(mainEl.querySelector('.hypercube-spinner'), {
    points: Vector.hypercube(4, 1),
});
