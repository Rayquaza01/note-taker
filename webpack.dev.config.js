/* eslint-env node */

module.exports = {
    mode: "development",
    entry: {
        notes: "./src/notes/notes.js",
        options: "./src/options/options.js",
        background: "./src/background.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    }
};
