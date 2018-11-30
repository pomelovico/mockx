const Server = require('./Server');

class ServerManager{
    constructor(service){
        this.service = service;
        this.ACTION_TYPE = service.ACTION_TYPE;
        this.servers = {};
    }
    create(sid){
        if(this.servers[sid]){
            return;
        }
        return this.fetchServerInfo(sid,true).then(res=>{
            let server = new Server(res,this.service);
            this.servers[sid] = server;
            return server.updateServerInfo(res);
        });
    }
    remove(sid){
        let server = this.servers[sid];
        if(server){
            server.stop();
            delete this.servers[sid];
        }
    }
    //查询Server信息
    fetchServerInfo(sid,withInterfaces){
        return Promise.all([
            this.service.fetch(this.ACTION_TYPE.QUERY_SERVER,{sid}),
            withInterfaces ? this.service.fetch(this.ACTION_TYPE.QUERY_INTERFACE_ALL_MORE,{sid}) : [],
        ]).then(([s,i])=>{
            let baseInfo = {};
            for(let k=0;k<s.length;k++){
                if(sid === s[k].sid){
                    baseInfo = s[k];
                    break;
                }
            }
            let interfaces = (i && i.length !=0) ? i.reduce((res,next)=>{
                res[next.path] = next;
                return res
            },{}) : null;

            return {
                baseInfo,
                interfaces: withInterfaces ? interfaces : null
            }
        });
    }
    /*
    sid:  server-id
    id:   interface-id
    */
    update(sid,updateInterface){
        let server = this.servers[sid];
        if(server){
            this.fetchServerInfo(sid,updateInterface).then(res=>{
                server.updateServerInfo(res);
                //在运行中则重启server
                server.status == 1 && server.restart();
            });
        }
        return Promise.resolve(true);
    }
    run(sid){
        let server = this.servers[sid];
        if(server){
            return server.status == 0 && server.start();
        }else{
            return this.create(sid).then(()=>{
                return this.run(sid);
            });
        }
        return Promise.resolve(true);
    }
    stop(sid){
        let server = this.servers[sid];
        server && server.stop();
    }
}

module.exports = ServerManager;