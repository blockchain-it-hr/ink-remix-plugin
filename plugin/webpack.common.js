const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './index.tsx',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: "/node_modules/",
                loader: "ts-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.scss']
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: "/"
    },
    plugins: [
        new CopyPlugin([
            path.resolve(__dirname, "public")
        ]),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
        }),
        new webpack.EnvironmentPlugin({
            WS_BASE_URL: 'ws://localhost:65520'
        })
    ]
}
