const config = require('./webpack.base.config');


const merge = require('webpack-merge');


const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(config, {
    mode: 'production',

    plugins: [
        new CleanWebpackPlugin()
    ]
})