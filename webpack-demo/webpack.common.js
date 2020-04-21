const path = require('path');
const webpack = require('webpack');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWepackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // 入口js路径
    entry: {
        index: './src/js/index.js',
        login: './src/js/login.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery-1x',
            jQuery: 'jquery-1x'
        }),
        // 自动清空dist目录
        new CleanWebpackPlugin(),
        // 设置html模板生成路径
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/html/login.ejs',
            chunks: ['style', 'jquery', 'login']
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.ejs',
            chunks: ['style', 'jquery', 'index']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new CopyWepackPlugin([{
            from: './src/static',
            to: 'static'
        }])
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /jquery/,
                    name: 'jquery',
                    chunks: 'all'
                },
                styles: {
                    test: /[\\/]common[\\/].+\.css$/,
                    name: 'style',
                    chunks: 'all',
                    enforce: true
                }

            }
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: true
                }
            })
        ]
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules | bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: '../'
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.ejs/,
                use: ['ejs-loader']
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src', 'audio:src'], //此处的参数值  img是指html中的 <img/> 标签， src是指 img的src属性   表示 html-loader 作用于 img标签中的 src的属性
                        minimize: true
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif|webp)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 图片输出的实际路径(相对于dist)
                        // 当小于某KB时转为base64
                        esModule: false,
                        outputPath: 'images',
                        limit: 0
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // 保留原文件名和后缀名
                        name: '[name].[ext]',
                        // 输出到dist/fonts/目录
                        outputPath: 'fonts',
                    }
                }
            }

        ]
    },
    //编译输出的js及路径
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}