console.log('starting main');

const Vector = require('./vector');
const PolygonSpinner = require('./polygon-spinner');
const Spinner3d = require('./spinner3d');
const Spinner4d = require('./spinner4d');

const template = `

<h2>2d spinner</h2>
<div class="container2"></div>

<h2>3d spinner</h2>
<div class="container3"></div>

<h2>4d spinner</h2>
<div class="container4"></div>
`;

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

PolygonSpinner(mainEl.querySelector('.container2'));

Spinner3d(mainEl.querySelector('.container3'), {
    points: Vector.cube(0.5),
});

Spinner4d(mainEl.querySelector('.container4'), {
    points: Vector.hypercube(4, 1),
});
