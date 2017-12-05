console.log('starting main');

const PolygonSpinner = require('./polygon-spinner');
const CubeSpinner = require('./cube-spinner');

const template = `
<h2>rotating polygon</h2>
<div class="polygon-spinner"></div>
<h2>rotating cube</h2>
<div class="cube-interaction"></div>
`;

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

var spinner = PolygonSpinner(mainEl.querySelector('.polygon-spinner'));

var cube = CubeSpinner(mainEl.querySelector('.cube-interaction'));

