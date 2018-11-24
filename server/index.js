const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerController = require('./controller/ServerController');
const InterfaceController = require('./controller/InterfaceController');

const serverController = new ServerController();
const interfaceController = new InterfaceController();

function logger(req,res,next){
    next();
}
app.use((req,res,next)=>{
    res.setHeader
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})
app.use(logger);

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

app.listen(3001,()=>{  console.log('listening at 3001');})