module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
    },
    plugins: [
        'jest',
    ],
    extends: [
        'eslint:recommended',
        'plugin:jest/recommended',
    ],
    env: {
        es6: true,
        node: true,
        jest: true,
        'jest/globals': true,
    },
    rules: {
        ...require('./eslint/bestPractices'),
        ...require('./eslint/errors'),
        ...require('./eslint/es6'),
        ...require('./eslint/node'),
        ...require('./eslint/style'),
        ...require('./eslint/variables'),
        'babel/no-invalid-this': 'off',
        'no-invalid-this': 'off',
        'no-console': 'off',
    },
};
