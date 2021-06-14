const path=require('path');
module.exports={
    mode:'development',
    entry:path.resolve(__dirname,'src/index.js'),
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'main.js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins:[["@babel/plugin-proposal-decorators",{"legacy":true}]]
                    }
                }
            }
        ]
    },
    devtool:'inline-source-map'
}