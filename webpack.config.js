const path = require('path');
const webpack = require('webpack');
const UglyfyPlugin  = require('uglifyjs-webpack-plugin');


module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'build')
    },
    resolve:{
        extensions:['.jsx','.js']
    },
    devtool:'source-map',
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                use:[{
                    loader:'babel-loader',
                    options:{
                        cacheDirectory: true,
                        presets:['@babel/preset-react'],
                        plugins:[
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-proposal-class-properties",
                            ["import", {
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": "css" // `style: true` 会加载 less 文件
                            }]
                        ],
                    }
                }]
            },
            {
                test:/\.css$/,
                // use:ExtractTextPlugin.extract({
                //     fallback: "style-loader",s
                //     use: "css-loader"
                //   })
                loader:['style-loader','css-loader']
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins:[
        // new ExtractTextPlugin('style.css'),
        // new UglyfyPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {     //压缩代码
        //         dead_code: true,    //移除没被引用的代码
        //         warnings: false,     //当删除没有用处的代码时，显示警告
        //         loops: true //当do、while 、 for循环的判断条件可以确定是，对其进行优化
        //     },
        // })
        new webpack.ProvidePlugin({
            Service:path.resolve(__dirname,'./src/service.web.js')
        })
    ]
}