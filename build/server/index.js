const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ServerController = require('./controller/ServerController');
const serverController = new ServerController();

function logger(req,res,next){
    // console.log(req.path);
    console.log(req)
    next();
}
app.use(logger);

app.get('/server/list',(req,res)=>{
    serverController.queryServer(req,res);
})

app.post('/server/add',(req,res)=>{
    serverController.addServer(req,res);
})
app.post('/server/remove/:sid',(req,res)=>{
    serverController.removeServer(req,res);
})
app.post('/server/update',(req,res)=>{
    serverController.updateServer(req,res);
})

app.listen(3001,()=>{
    console.log('listening');
})