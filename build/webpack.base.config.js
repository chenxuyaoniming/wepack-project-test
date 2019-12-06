
const MiniCssPlugin = require('mini-css-extract-plugin');

const htmlPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

const path = require('path');

const fs = require('fs');

//js入口路径
const ENTRY_JS = path.resolve(__dirname, '../src/js');

//html入口路径

const ENTRY_HTML = path.resolve(__dirname, '../src/html');
/**
 * 多入口配置
 */

function htmlList() {
    let arr = fs.readdirSync(ENTRY_HTML);

    let templeteArr =  arr.map(i => {
        return new htmlPlugin({
            template: `${ENTRY_HTML}/${i}`,
            filename: `${i}`,
            chunks: ['vendors', 'manifest', i.split('.')[0]]
        })
    })

    return templeteArr;
}

function jsEntry() {

    let arr = fs.readdirSync(ENTRY_JS);

    let obj = {}

    arr.reduce((a, b) => {
        let name = b.split('.')[0];
        obj[name] = `${ENTRY_JS}/${b}`;
    }, obj);

    return obj;
}

module.exports = {
    //入口
    entry: jsEntry(),

    output: {
        publicPath: '',
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[hash:8].js' 
    },

    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                // Creates `style` nodes from JS strings
                {
                    loader: MiniCssPlugin.loader,
                    options: {
                        publicPath: '/'
                    }
                },
                // Translates CSS into CommonJS
                'css-loader',
                // Compiles Sass to CSS
                'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            //处理静态文件
            {
                test: /\.(jpeg|jpg|png|gif|woff|ttf)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[ext]',
                    },
                  },
                ],
            },
        ]
    },

    plugins: [
        ...htmlList(),

        new MiniCssPlugin({
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/index.[hash:8].css'
        }),

        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],

    optimization: {
        // 找到chunk中共享的模块,取出来生成单独的chunk
        splitChunks: {
            chunks: "all",  // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
            cacheGroups: {
                vendors: {  // 抽离第三方插件
                    // test: /[\\/]node_modules[\\/]/,     // 指定是node_modules下的第三方包
                    name: "vendors",
                    priority: -10                       // 抽取优先级
                },
                // utilCommon: {   // 抽离自定义工具库
                //     name: "common",
                //     minSize: 0,     // 将引用模块分离成新代码文件的最小体积
                //     minChunks: 2,   // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
                //     priority: -20
                // }
            }
        },
        // 为 webpack 运行时代码创建单独的chunk
        runtimeChunk:{
            name:'manifest'
        }
    }
}