const config = require('./webpack.base.config.js');

const merge = require('webpack-merge');

const webpack = require('webpack');

module.exports = merge(config, {
    mode: 'development',
    devtool: "#@inline-source-map",
    devServer: {
        port: '6688',
        contentBase: '../dist',
        hot: true,
        compress: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})