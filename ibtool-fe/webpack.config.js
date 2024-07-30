// const path = require('path');
// const HtmlWebpackPlugin = require("html-webpack-plugin");

import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config = {
    entry: ['./views/Login/login.js'],
    mode: 'development',
    target: "web",
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
            inject: 'head',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname),
        },
        compress: true,
        port: 9000,
        open: true,
        hot: false,
        liveReload: false,
        // inline: false,
    },
    module: {
        rules: [{
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "js"),
                    path.resolve(__dirname, "pages"),
                ],
            }
        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, "js"),
            path.resolve(__dirname, "pages"),
        ]
    },
    watchOptions: {
			ignored: ['**/node_modules', '**/libs'],
		},
};

export default config;