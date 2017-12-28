function Dot(vector, color) {
    var _renderer;
    var _vector = vector.slice();
    var _color = color;
    return {
        register(renderer) {
            _renderer = renderer;
        },
        render() {
            _renderer.render([_vector], [_color]);
        },
        get vector() {
            return _vector;
        },
    };
}

module.exports = Dot;
