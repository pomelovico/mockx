const DataBase = require('../db/db');
const ServerModel = require('../model/ServerModel');

class ServerController{
    constructor(props){
        this.model = new ServerModel(new DataBase());
    }
    queryServer(req,res){
        this.model.get().then(data=>{
            res.send(data);
        },err=>{
            res.send(err)
        })
    }
    addServer(req,res){
        const {name} = req.body;
        if(!name){
            res.send({msg:'name invalid'});
            return;
        }
        this.model.create(name).then(result=>{
            res.send(result);
        });
    }
    removeServer(req,res){
        const {sid} = req.params;
        if(!sid){
            res.send({'msg':"sid invalid"});
            return;
        }
        this.model.delete(sid).then((result)=>{
            res.send(result);
        })
    }
    updateServer(req,res){
        const {sid,...data} = req.body;
        if(!sid || Object.prototype.toString.call(data) != '[object Object]'){
            res.send({msg:'sid or data invalid'});
            return;
        }
        this.model.update(sid,data).then(result=>{
            res.send(result);
        })
    }
}

module.exports = ServerController;