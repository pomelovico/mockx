const service = require('./service');
const express = require('express');
const path = require('path');

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

// const S = require('./ServerManager');

// const s = new S(service);
// s.run('s_1543061467334_vfgv');

// setTimeout(()=>{
//     // s.update('s_1543061467334_vfgv');
// },1000)

// const app = express();

// app.get('*',function(req,res){
//     res.send('fv');
// })

// try{
//     app.listen(3001,function(err){
//         console.log('listen err');
//     })
//     app.on('error',(err)=>{
//         console.log('ertfds')
//     })
// }catch(e){
//     console.log('sfd')
// }

var net = require('net')

// 检测端口是否被占用
function portIsOccupied (port) {
  // 创建服务并监听该端口
  var server = net.createServer().listen(port)

  server.on('listening', function () { // 执行这块代码说明端口未被占用
    server.close() // 关闭服务
    console.log('The port【' + port + '】 is available.') // 控制台输出信息
  })

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') { // 端口已经被使用
      console.log('The port【' + port + '】 is occupied, please change other port.')
    }
  })
}

// 执行
// portIsOccupied(3001);