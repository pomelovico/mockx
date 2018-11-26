var _service = require('../server/service.js');
const ServerManager = require('../server/ServerManager');

const serverManager = new ServerManager(_service);

module.exports =  (function({ACTION_TYPE,fetch}){
    let reg = /(UPDATE)|(ADD)|(REMOVE)/;

    function _fetch(type,payload){
        return fetch(type,payload).then(res=>{
            if(reg.test(type)){
                //截获更新操作,通知serverManager更新
                console.log('updating server');
                let {sid,id} = payload;
                serverManager.update(sid,id);
            }
            return res;
        },err=>{
            return err;
        });
    }
    return {
        fetch:_fetch,
        ACTION_TYPE,
    }
})({..._service});