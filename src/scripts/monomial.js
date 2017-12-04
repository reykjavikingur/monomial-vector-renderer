const Monomial = {
    create(coefficients) {
        return x => {
            var sum = 0;
            for (let n in coefficients) {
                let c = coefficients[n];
                let xn = Math.pow(x, n);
                sum += c * xn;
            }
            return sum;
        };
    },
};

module.exports = Monomial;
