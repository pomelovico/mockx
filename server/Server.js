const express = require('express');
const bodyParser = require('body-parser');
var net = require('net');

class Server{
    constructor(info,service){
        this.service = service;
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

        //TODO，读取每个interface，注册路由
        let {baseInfo,interfaces} = this.info;
        for(let path in interfaces){
            let currentInterface = interfaces[path],
                {method,res_body,res_header,res_cookie} =  currentInterface;
            method = method.toLowerCase();
            try{
                res_header = JSON.parse(res_header);
            }catch(e){
                res_header = {};
            }
            try{
                res_cookie = JSON.parse(res_cookie);
            }catch(e){
                res_cookie = {};
            }
            
            let {prefix} = baseInfo;
            if(prefix != ''){
                prefix = '/' + prefix.replace(/^(\/)*|((\/)*)$/g,'');
            }
            path = '/' + path.replace(/^(\/)*/,'');
            //注册路由
            app[method] && app[method](prefix+path,(req,res)=>{
                this.logger(req,currentInterface).then(()=>{
                    for(let key in res_cookie){
                        res.cookie(key,res_cookie[key]);
                    }
                    res.set(res_header);
                    res.send(res_body);
                },(error)=>{
                    console.log(error);
                    res.send(error);
                });
            })
        }
        this.app = app;
        this.status = 0;
        return this;
    }
    logger(request,interfaces){
        let {method,req_header} = interfaces;

        /* 写入日志 */
        this.service.fetch(this.service.ACTION_TYPE.ADD_REQUEST_LOG,{
            server:{
                sid:this.info.baseInfo.sid,
                url:`${request.headers.host}:${request.originalUrl}`
            },
            request:{
                method:interfaces.method,
                req_body:JSON.stringify(request.body),
                req_header:JSON.stringify(request.headers),

                res_body:interfaces.res_body,
                res_header:interfaces.res_header
            }
        });

        return new Promise((resolve,reject)=>{
            
            //验证 请求 正确性
            //请求头验证
            try{
                req_header = JSON.parse(req_header);
            }catch(e){
                req_header = {};
            }
            let result = this.check(req_header,request.headers,true);
            if(result !== true){
                reject({requireHeader:'',...result});
                return;
            } 
            //请求参数验证
            if(method == 'get' || method == 'post'){
                let map = {
                    post:['req_body','body'],
                    get:['req_params','query']
                }
                let required = JSON.parse(interfaces[map[method][0]]);
                let currentObj = request[map[method][1]];
                let result = this.check(required,currentObj);
                if(result !== true){
                    reject(result);
                    return;
                }
            }
            //其他方法暂时默认成功
            resolve();
        }) 
    }
    check(requiredObj,currentObj,caseInsensitive){
        let currentObjKeys = Object.keys(currentObj);
        if(caseInsensitive){
            currentObjKeys = currentObjKeys.map(k=>k.toLowerCase());
        }
        for(let key in requiredObj){
            let lowerKey = caseInsensitive ? key.toLowerCase() : key; //关键字大小写是否敏感
            let value = requiredObj[key];
            if(currentObjKeys.indexOf(lowerKey) === -1){
                return {
                    errorStatus:1,
                    _requireKey:key
                }
            }
            if(value !=  '' && currentObj[key] != value){
                return {
                    errorStatus:2,
                    _requireKey:key,
                    _requireKeyValue:value
                }
            }
        }
        return true;
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
                this.listener = this.app.listen(port,'127.0.0.1',()=>{
                    resolve();
                    console.log('start sever...port=' + port);
                    this.status = 1;
                });
            },(err)=>{
                console.log('err at port' + port);
                reject(err);
            })
        })
    }
    stop(){
        if(this.status == 1){
            console.log('stop server..');
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