const DataBase = require('../db/db');
const InterfaceModel = require('../model/InterfaceModel');

class InterfaceController{
    constructor(){
        this.model = new InterfaceModel(new DataBase());
    }
    queryInterfaceDetail(req,res){
        let {id} = req.query;
        this.model.get(id).then(data=>{
            res.send(data);
        },err=>{
            res.send(err)
        })
    }
    queryAllInterface(req,res){
        let {sid} = req.query;
        this.model.getAll(sid).then(data=>{
            res.send(data);
        },err=>{
            res.send(data);
        })
    }
    addInterface(req,res){
        const {sid} = req.body;
        if(!sid){
            res.send({msg:'sid invalid'});
            return;
        }
        this.model.create(sid).then(result=>{
            res.send(result);
        });
    }
    removeInterface(req,res){
        const {id} = req.params;
        if(!id){
            res.send({'msg':"id invalid"});
            return;
        }
        this.model.delete(id).then((result)=>{
            res.send(result);
        })
    }
    updateInterface(req,res){
        const {id,...data} = req.body;
        if(!id){
            res.send({msg:'id or data invalid'});
            return;
        }
        this.model.update(id,data).then(result=>{
            res.send(result);
        })
    }
}

module.exports = InterfaceController;