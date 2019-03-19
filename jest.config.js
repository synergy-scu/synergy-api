module.exports = {
    collectCoverageFrom: [
        'app/**/*.js',
        '!app/**/server.js',
        '!**/node_modules/**',
    ],
    coverageDirectory: '<rootDir>/build_artifacts',
    coverageReporters: ['text', 'clover', 'cobertura', 'lcov'],
    resetModules: true,
    verbose: true,
    reporters: [
        'default',
        [
            'jest-junit',
            {
                'output': '<rootDir>/build_artifacts/junit.xml',
            },
        ],
    ],
};
