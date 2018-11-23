const InterfaceModel = require('./model/InterfaceModel');
const ServerModel = require('./model/ServerModel');
const DataBase = require('./db/db');

const db = new DataBase();
const im = new InterfaceModel(db);
const sm = new ServerModel(db);

//
const ACTION_TYPE = {
    ADD_SERVER:'ADD_SERVER',
    ADD_INTERFACE:"ADD_INTERFACE",

    REMOVE_SERVER:"REMOVE_SERVER",
    REMOVE_INTERFACE:'REMOVE_INTERFACE',

    UPDATE_SERVER:"UPDATE_SERVER",
    UPDATE_INTERFACE:"UPDATE_INTERFACE",

    QUERY_SERVER:"QUERY_SERVER",
    QUERY_INTERFACE_ALL:"QUERY_ALL_INTERFACE_ALL",
    QUERY_INTERFACE_DETAIL:"QUERY_INTERFACE_DETAIL"
}

//偏函数，提前统一注入模型对象，
const createHandler = (model) => callback => {
    return function(){
        const args = [].slice.call(arguments);
        return callback.apply(null,args.concat(model));
    }
}


const handleServer = createHandler(sm);
const handleInterface = createHandler(im);

//Server相关
const _removeServer = handleServer(({sid}, sm) => sm.delete(sid));
const _addServer = handleServer(({name},sm) => {
    if(!name){
        return Promise.reject('invald name');
    }
    return sm.create(name);
});
const _updateServer = handleServer((payload,sm)=>{
    const {sid,...data} = payload;
    if(!sid){
        return Promise.reject('invalid  sid');
    } 
    return sm.update(sid,data);
})
const _queryServer = handleServer((payload,sm) => sm.get(payload))

//Interface相关
const _addInterface = handleInterface(({sid},im)=>{
    if(!sid){
        return Promise.reject('invalid sid');
    }
    return im.create(sid);
})
const _removeInterface = handleInterface(({id},im) => im.delete(id))
const _updateInterface = handleInterface((payload,im)=>{
    const {id,...data} = payload;
    return im.update(id,data);
})

const _queryInterfaceAll = handleInterface(({sid},im) => im.getAll(sid));
const _queryInterfaceDetail = handleInterface(({id},im) => im.get(id) );


function fetch(actionType,payload){
    switch(actionType){

        case ACTION_TYPE.ADD_SERVER : return _addServer(payload);

        case ACTION_TYPE.ADD_INTERFACE : return _addInterface(payload);

        case ACTION_TYPE.REMOVE_SERVER : return _removeServer(payload);

        case ACTION_TYPE.REMOVE_INTERFACE : return _removeInterface(payload);

        case ACTION_TYPE.UPDATE_SERVER : return _updateServer(payload);

        case ACTION_TYPE.UPDATE_INTERFACE : return _updateInterface(payload);

        case ACTION_TYPE.QUERY_SERVER : return _queryServer(payload);

        case ACTION_TYPE.QUERY_INTERFACE_ALL : return _queryInterfaceAll(payload);

        case ACTION_TYPE.QUERY_INTERFACE_DETAIL : return _queryInterfaceDetail(payload);
    }
}

module.exports = {
    ACTION_TYPE,
    fetch
}