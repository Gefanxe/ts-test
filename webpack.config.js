const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ProgressPlugin } = require("webpack");

console.log("環境:", process.env.NODE_ENV);

module.exports = {
    performance: {
        hints: false,
    },
    mode: process.env.NODE_ENV ? "production" : "development",
    entry: path.resolve(__dirname, `./src/main.ts`),
    output: {
        filename: "./main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        library: "main",
        clean: true,
    },
    devServer: {
        host: "local-ip",
        static: "./dist",
        hot: true,
    },
    devtool:
        process.env.NODE_ENV === "production"
            ? "hidden-source-map"
            : "eval-cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            { test: /\.tsx?$/, loader: "ts-loader" },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "./public"), to: "public" },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
};
