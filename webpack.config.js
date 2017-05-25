const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/only-dev-server',
        './src/bootstrap/client.js',
    ],

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/static/'
    },

    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    },

    devServer: {
        host: 'localhost',
        port: 3001,
        historyApiFallback: true,
        hot: true
    },
};