const Animator = require('./animator');
const GraphRenderer = require('./graph-renderer');
const PlayerDot = require('./player-dot');

const template = `
<div class="game" tabindex="0">
<canvas width="256" height="256"></canvas>
</div>
`;

function Game(node) {

    if (!node) {
        console.error('Game is missing node');
        return;
    }

    node.innerHTML = template;

    var gameNode = node.querySelector('.game');
    gameNode.focus();

    var player = PlayerDot(gameNode, [0, 0, 0, 0], 'green');

    var graphRenderer = GraphRenderer(node.querySelector('canvas'), {
        xmin: -2, ymin: -2,
        xmax: 2, ymax: 2,
    });
    player.register(graphRenderer);

    var animator = Animator(() => {
        player.render();
    });

    animator.start();

    return {
        done() {
            graphRenderer.done();
            animator.done();
            keyboardListener.done();
            player.done();
        },
    }
}

module.exports = Game;
