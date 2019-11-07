const merge = require('webpack-merge');
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        port: '3000',
        disableHostCheck: true,
        hot: true,
        host: 'localhost'
    },
});