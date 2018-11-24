const DataBase = require('../db/db');
const InterfaceModel = require('../model/InterfaceModel');
const {successReturn,failReturn} = require('../handleReturn');

class InterfaceController{
    constructor(){
        this.model = new InterfaceModel(new DataBase());
    }
    queryInterfaceOne(req,res){
        let {id} = req.query;
        this.model.get(id).then(successReturn(res),failReturn(res,801));
    }
    queryInterfaceAll(req,res){
        let {sid} = req.query;
        this.model.getAll(sid).then(successReturn(res),failReturn(res,801));
    }
    addInterface(req,res){
        const {sid} = req.body;
        if(!sid){
            return failReturn(res,804)({msg:'sid invalid'});
        }
        this.model.create(sid).then(successReturn(res),failReturn(res,802));
    }
    removeInterface(req,res){
        const {id} = req.body;
        if(!id){
            return failReturn(res,804)({msg:'id invalid'});
        }
        this.model.delete(id).then(successReturn(res),failReturn(res,803));
    }

    updateInterface(req,res){
        const {id,...data} = req.body;
        if(!id){
            return failReturn(res,804)({msg:'id or data invalid'});
        }
        this.model.update(id,data).then(successReturn(res),failReturn(res,804));
    }
}

module.exports = InterfaceController;