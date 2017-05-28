const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/bootstrap/client.js'
    ],

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static'),
        publicPath: '/static/'
    },

    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                ]
            },
        ],
    },

    plugins: [
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    }
};