/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtrackPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    const config = {
        mode: argv.mode,
        entry: {
            index: __dirname + "/src/index.tsx"
        },
        devtool: "source-map",
        output: {
            path: __dirname + "/dist",
            filename: "[name].bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtrackPlugin.loader, "css-loader"]
                }
            ]
        },
        resolve: {
            extensions: [ ".ts", ".tsx", ".js", ".jsx" ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "src/index.html",
                filename: "index.html",
                chunks: ["index"],
            }),
            new copyWebpackPlugin({
                patterns: [
                    { from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js", to: "third-party/browser-polyfill.min.js" },
                    { from: "node_modules/react/umd/" + (argv.mode === "production" ? "react.production.min.js" : "react.development.js"), to: "third-party/react.js"},
                    { from: "node_modules/react-dom/umd/" + (argv.mode === "production" ? "react-dom.production.min.js" : "react-dom.development.js"), to: "third-party/react-dom.js"}
                ]
            }),
            new MiniCssExtrackPlugin()
        ],
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
        },
        optimization: {
            usedExports: true,
            minimizer: [
                new CssMinimizerWebpackPlugin(),
                new TerserWebpackPlugin()
            ]
        }
    }

    return config;
}
