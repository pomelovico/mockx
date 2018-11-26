const express = require('express');
const bodyParser = require('body-parser');

class Server{
    constructor(info){
        this.sid = info.sid;
        this.info = info;
        this.reset();
    }
    //初始化Server
    reset(){
        if(this.status == 1){
            //server运行中，则停止运行;
            this.app.stop();
        }
        //创建新的server实例
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        //跨域设置
        app.use((req,res,next)=>{
            res.setHeader("Access-Control-Allow-Origin","*");
            res.setHeader("Access-Control-Allow-Methods","*");
            res.setHeader("Access-Control-Allow-Headers","*");
            next();
        });
        //请求日志
        app.use((req,res,next)=>{
            let {path,query,body,method} = req;
            //TODO 日志记录
            next();
        });

        //TODO，读取每个interface，注册路由
        let {baseInfo,interfaces} = this.info;
        for(let path in interfaces){
            let {method,res_body} = interfaces[path];
            method = method.toLowerCase();
            app[method] && app[method](baseInfo.prefix+path,(req,res)=>{
                console.log(res_body);
                res.send(res_body);
            })
        }
        this.app = app;
        this.status = 0;
        return this;
    }
    start(){
        return new Promise((resolve,reject)=>{
            this.listener = this.app.listen(this.info.baseInfo.port,(err)=>{
                if(err){
                    //TODO 启动失败
                    reject(err);
                }else{
                    resolve()
                    this.status = 1;
                }
            });
        })
    }
    stop(){
        console.log(this.app);
        if(this.status == 1){
            this.listener.close();
            this.status = 0;
        }
        return this;
    }
    restart(){
        return this.stop().reset().start();
    }
    //更新的数据来自于Manager
    updateServerInfo({baseInfo,interfaces}){
        this.info.baseInfo = baseInfo;
        if(interfaces !== null){
            this.info.interfaces = interfaces;
        }
        return this;
    }
}

module.exports= Server;