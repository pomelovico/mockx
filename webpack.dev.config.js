const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry:'./src/index.js',
    // target:'electron-renderer',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'build'),
        
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
                        presets:['@babel/preset-env','@babel/preset-react'],
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
    devServer:{
        contentBase: path.join(__dirname, 'build'),
        hot:true,
        port:8000
    },
    plugins:[
        // new ExtractTextPlugin('style.css')
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            Service:path.resolve(__dirname,'./src/service.web.js')
        })
    ]
}