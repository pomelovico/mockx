// import {ACTION_TYPE} from './constant';
import Axios from 'axios';

const HOST = 'http://localhost:3001/';

function _fetch(url,payload,method){
    if(method == 'get'){
        return Axios.get(HOST+url,{params:payload}).then(response=>{
            return response.data.data;
        });
    }else{
        return Axios.post(HOST + url,payload).then(response=>{
            return response.data;
        });
    }
}
export const ACTION_TYPE = {
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

export function fetch (actionType,payload){
    switch(actionType){
        case ACTION_TYPE.ADD_SERVER : return _fetch('server/add',payload);
        case ACTION_TYPE.ADD_INTERFACE : return _fetch('interface/add',payload);

        case ACTION_TYPE.REMOVE_SERVER : return _fetch('server/remove',payload);
        case ACTION_TYPE.REMOVE_INTERFACE : return _fetch('interface/remove',payload);

        case ACTION_TYPE.UPDATE_SERVER : return _fetch('server/update',payload);
        case ACTION_TYPE.UPDATE_INTERFACE : return _fetch('interface/update',payload);

        case ACTION_TYPE.QUERY_SERVER : return _fetch('server/query',payload,'get');
        case ACTION_TYPE.QUERY_INTERFACE_ALL : return _fetch('interface/query_all',payload,'get');
        case ACTION_TYPE.QUERY_INTERFACE_DETAIL : return _fetch('interface/query_one',payload,'get');
    }
}