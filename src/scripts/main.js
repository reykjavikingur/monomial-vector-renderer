console.log('starting main');

const Game = require('./game');

const template = `
<h2>game</h2>
<div class="game-container"></div>
`;

var mainEl = document.querySelector('main');

mainEl.innerHTML = template;

var game = Game(mainEl.querySelector('.game-container'));
