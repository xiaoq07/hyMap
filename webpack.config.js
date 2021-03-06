/* eslint-disable import/no-extraneous-dependencies */
/*
 * @Author: FunctionRun
 * @Date:   2017-01-10 10:15:18
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-08-22 21:08:32
 * @Email: zhangyujie3344521@163.com
 * @File Path: F:\work\hyMap\webpack.config.js
 * @File Name: webpack.config.js
 * @Descript:
 */

'use strict';

const path = require('path');
const webpack = require('webpack');

const libJson = require('./build/lib_manifest.json');

// const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const hostConfig = {
    host: 'localhost',
    port: '8110'
};
const publicPath = '/build/';

let webpackConfig = {
    entry: [
        './index.js'
    ],
    resolve: {
        extensions: ['.js', '.json', '.css', '.styl', '.sass', '.scss'],
        alias: {
            geojsonvt: path.join(__dirname, '/public/lib/geojson-vt-dev'),
            ol: path.join(__dirname, '/public/lib/ol-debug'),
            turf: path.join(__dirname, '/public/lib/turf.min'),
            sockjs_min: path.join(__dirname, 'public/lib/sockjs.min'),
            stomp: path.join(__dirname, 'public/lib/stomp.min'),
            mapboxgl: path.join(__dirname, 'public/lib/mapbox-gl')
        }

    },
    output: {
        path: path.join(__dirname, 'build'),
        //chunkFilename: 'chunk/[chunkhash:8].chunk.min.js',
        filename: 'hymap_bundle.js',
        publicPath
    },
    devServer: {
        host: hostConfig.host,
        port: hostConfig.port,
        historyApiFallback: true,
        disableHostCheck: true
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [{
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
        }, {
            test: /\.js?$/,
            loader: 'babel-loader',
            include: [
                // 只去解析运行目录下的 src
                path.join(process.cwd(), './src'),
                path.join(process.cwd(), './test'),
                path.join(process.cwd(), './index.js'),
                path.join(process.cwd(), './routes.js')

            ]

        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=25000'
        }],
        noParse: [
            path.join(process.cwd(), './public')
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: libJson
        })
    ]
};

// 开发环境下的配置
if (process.env.NODE_ENV === 'DEVELOPMENT') {

    webpackConfig = Object.assign(webpackConfig, {

        output: {
            path: path.join(__dirname, 'build'),
            filename: 'hymap_bundle.js',
            chunkFilename: 'chunk/[chunkhash:8].chunk.min.js',
            publicPath: 'http://' + hostConfig.host + ':' + hostConfig.port + publicPath
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: libJson
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    });

}

module.exports = webpackConfig;