console.log('starting main');

const PolygonSpinner = require('./polygon-spinner');
const Spinner3d = require('./spinner3d');

const template = `
<h2>rotating polygon</h2>
<div class="polygon-spinner"></div>
<h2>rotating cube</h2>
<p>representation of a cube shown rotating around each of x, y, z axes</p>
<span class="cube-spinner"></span>
`;

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

var spinningPolygon = PolygonSpinner(mainEl.querySelector('.polygon-spinner'));

var spinner3d = Spinner3d(mainEl.querySelector('.cube-spinner'));
