const express = require('express');
const bodyParser = require('body-parser');
var net = require('net');

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
                res.send(res_body);
            })
        }
        this.app = app;
        this.status = 0;
        return this;
    }
    // 检测端口是否被占用
    portIsOccupied (port) {
        return new Promise((resolve,reject)=>{
            // 创建服务并监听该端口
            var server = net.createServer().listen(port)
            server.on('listening', function () { // 执行这块代码说明端口未被占用
                server.close() // 关闭服务
                resolve();
            })
            server.on('error', ()=>{
                reject('port occupied');
            });
        });
    }
    start(){
        return new Promise((resolve,reject)=>{
            let {port} = this.info.baseInfo;
            this.portIsOccupied(port).then(()=>{
                this.listener = this.app.listen(port,()=>{
                    resolve();
                    this.status = 1;
                });
            },(err)=>{
                reject(err);
            })
        })
    }
    stop(){
        if(this.status == 1){
            console.log('stop server');
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