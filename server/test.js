const service = require('./service');

const {ACTION_TYPE,fetch} = service;

// fetch(ACTION_TYPE.QUERY_INTERFACE_DETAIL,{id:'api_1542784340542_sgfjm'}).then(res=>{
//     console.log(res);
// });

// fetch(ACTION_TYPE.ADD_SERVER,{name:'hdhdsh'}).then(res=>{
//     console.log(res);
// });

// fetch(ACTION_TYPE.UPDATE_SERVER,{sid:'s_1542852840366_3r0m',name:'lij789',port:4567}).then(res=>{
//     console.log(res);
// });
// fetch(ACTION_TYPE.UPDATE_INTERFACE,{
//     id:'api_1542784340542_sgfjm',
//     path:'fsf/dsfs/d',
//     method:'post',
//     req_params:'fsd&sfdsd&fdsfs'
// }).then(res=>{
//     console.log(res);
// })
// service.fetch(ACTION_TYPE.QUERY_INTERFACE_ALL_MORE,{sid:'s_1543061467334_vfgv'}).then(res=>{
//     console.log(res);
// },err=>{})

const S = require('./ServerManager');

const s = new S(service);
s.create('s_1543061467334_vfgv').then(res=>{
    s.run('s_1543061467334_vfgv');
});

setTimeout(()=>{
    // s.update('s_1543061467334_vfgv');
},1000)