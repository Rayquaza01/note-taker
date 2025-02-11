/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                },
                {
                    test: /\.svg$/i,
                    use: ["@svgr/webpack"]
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
                    { from: "src/manifest.json" },
                    { from: "src/icons/", to: "icons", toType: "dir" },
                    { from: "src/_locales/", to: "_locales", toType: "dir" },
                ]
            }),
            new MiniCssExtractPlugin()
        ],
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
