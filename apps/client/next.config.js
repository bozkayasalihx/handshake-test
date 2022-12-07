const withTM = require("next-transpile-modules")([
    "ui",
    "store",
    "hooks",
    "scripts",
    "locales",
    "utils",
]);
const path = require("path");

module.exports = withTM({
    reactStrictMode: true,
    output: "standalone",
    experimental: {
        outputFileTracingRoot: path.join(__dirname, "../../"),
    },
    typescript: {
        ignoreBuildErrors: true,
    },
});
