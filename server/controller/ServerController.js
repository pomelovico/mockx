const DataBase = require('../db/db');
const ServerModel = require('../model/ServerModel');
const {successReturn,failReturn} = require('../handleReturn');

class ServerController{
    constructor(props){
        this.model = new ServerModel(new DataBase());
        this.query = this.query.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }
    query(req,res){
        this.model.get().then(successReturn(res),failReturn(res,801));
    }
    add(req,res){
        const {name} = req.body;
        if(!name){
            return failReturn(res,804)({msg:'name invalid'});
        }
        this.model.create(name).then(successReturn(res),failReturn(res,802));
    }
    remove(req,res){
        const {sid} = req.body;
        if(!sid){
            return failReturn(res,804)({msg:'sid invalid'});
        }
        this.model.delete(sid).then(successReturn(res),failReturn(res,803))
    }
    update(req,res){
        const {sid,...data} = req.body;
        if(!sid || Object.prototype.toString.call(data) != '[object Object]'){
            return failReturn(res,804)({msg:'sid invalid'});
        }
        this.model.update(sid,data).then(successReturn(res),failReturn(res,804))
    }
}

module.exports = ServerController;