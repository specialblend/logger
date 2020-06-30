const collectCoverageFrom = [
    '**/*.js',
    '**/*.ts',
];

const coverageThreshold = {
    global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
    },
};

const coveragePathIgnorePatterns = [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/jest.config.js',
    '<rootDir>/lib',
    '<rootDir>/scripts',
];

const globalSetup = './__mocks__/environment.js';
const setupFilesAfterEnv = ['./__mocks__/setup.js'];
const testEnvironment = 'node';

module.exports = {
    collectCoverageFrom,
    coverageThreshold,
    coveragePathIgnorePatterns,
    globalSetup,
    setupFilesAfterEnv,
    testEnvironment,
};
