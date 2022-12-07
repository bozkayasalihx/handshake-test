/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    coveragePathIgnorePatterns: ["/node_modules/", "dist"],
};