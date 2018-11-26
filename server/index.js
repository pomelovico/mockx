const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerController = require('./controller/ServerController');
const InterfaceController = require('./controller/InterfaceController');
const ServerManager = require('./ServerManager');
const service = require('./service');

const serverController = new ServerController();
const interfaceController = new InterfaceController();
const serverManager = new ServerManager(service);


function listenChange(req,res,next){
    let {method,path} = req,
        reg=/(interface)|(server)/;
    if(method == 'POST' && reg.test(path)){
        //TODO更新对应的Server
        let {id,sid} = req.body;
        res.on('close',()=>{
            serverManager.update(sid,id);
            console.log('updating server');
        })
    }
    next();
}

app.use((req,res,next)=>{
    res.setHeader
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})
app.use(listenChange);

//Routes

app.get('/server/query',serverController.query);
app.post('/server/add',serverController.add)
app.post('/server/remove',serverController.remove)
app.post('/server/update',serverController.update)

app.get('/interface/query_all',(req,res)=>{  interfaceController.queryInterfaceAll(req,res);})
app.get('/interface/query_one',(req,res)=>{  interfaceController.queryInterfaceOne(req,res);})
app.post('/interface/add',(req,res)=>{  interfaceController.addInterface(req,res);})
app.post('/interface/remove',(req,res)=>{  interfaceController.removeInterface(req,res);})
app.post('/interface/update',(req,res)=>{  interfaceController.updateInterface(req,res);});

//服务器启动
app.get('/operation',(req,res)=>{
    let {sid,operation} = req.query;
    switch(operation){
        case 'start':serverManager.run(sid).then(()=>{
            res.send('ok');
        },(err)=>{
            res.send(err);
        });break;
        case 'stop':serverManager.stop(sid).then(()=>{
            res.send('ok');
        });break;
        case 'restart':serverManager.update(sid,true).then(()=>{
            res.send('ok');
        },(err)=>{
            res.send(err);
        });break;
    };
});

app.listen(3001,()=>{  console.log('listening at 3001');})