/*
 * @Author: wxq
 * @Date:   2017-04-14 13:10:49
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-04-14 13:38:36
 * @Email: 304861063@qq.com
 * @File Path: H:\work\hyMap\webpack.dll.js
 * @File Name: webpack.dll.js
 * @Descript: 
 */
'use strict';
const webpack = require('webpack');
const path = require("path");
const vendors = [
    'react',
    'react-dom',
    'react-router',
    "style-loader",
    "brace",
    "antd"

    // ...其它库
];

module.exports = {
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        library: '[name]'
    },
    entry: {
        'lib': vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path: './build/lib_manifest.json',
            name: '[name]',
            context: __dirname
        })
    ]
};