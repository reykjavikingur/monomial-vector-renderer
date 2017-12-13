console.log('starting main');

const PolygonSpinner = require('./polygon-spinner');
const CubeSpinner = require('./cube-spinner');

const template = `
<h2>rotating polygon</h2>
<div class="polygon-spinner"></div>
<h2>rotating cube</h2>
<p>representation of a cube shown rotating around each of x, y, z axes</p>
<span class="xy-cube-spinner"></span>
<span class="yz-cube-spinner"></span>
<span class="xz-cube-spinner"></span>
`;

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

//*

var spinningPolygon = PolygonSpinner(mainEl.querySelector('.polygon-spinner'));

var yzSpinningCube = CubeSpinner(mainEl.querySelector('.yz-cube-spinner'), {rotation: [1, 2]});
var xzSpinningCube = CubeSpinner(mainEl.querySelector('.xz-cube-spinner'), {rotation: [0, 2]});
var xySpinningCube = CubeSpinner(mainEl.querySelector('.xy-cube-spinner'), {rotation: [0, 1]});

//*/

