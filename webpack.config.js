var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/pizza-finder.jsx',
    output: { path: __dirname, filename: 'pizza-finder.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "src/"),
                    ],
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
};