import React from 'react';
import axios from 'axios';

export const Context = React.createContext({});
const {ACTION_TYPE} = Service;

export function connect(Component){
    return function ConsumerWrapper(props){
        return <Context.Consumer>
        {  state =>  <Component context={state} {...props} />}
    </Context.Consumer>
    }
}
function withContext(Component){
    return class Root extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                panel:'builder',
                currentServer:null,
                servers:{},
            }
            this.actions = {
                queryServers:this.queryServers.bind(this),
                addServer:this.addServer.bind(this),
                removeServer:this.removeServer.bind(this),
                updateServer:this.updateServer.bind(this),
                switchPanel:this.switchPanel.bind(this),
                switchServer:this.switchServer.bind(this)
            };
        }
        componentDidMount(){
            this.queryServers((servers)=>{
                let keys = Object.keys(servers);
                this.setState({
                    currentServer:keys.length ? keys[0] : null
                });
            })
        }
        queryServers(cb){
            Service.fetch(ACTION_TYPE.QUERY_SERVER).then((servers)=>{
                if(servers.length != 0){
                    let temp = {};
                    servers.forEach(s=>{
                        temp[s.sid] = s;
                    });
                    this.setState({
                        servers:temp
                    });
                    cb&&cb(temp);
                }
            }).catch(()=>{})
        }
        addServer(){
            Service.fetch(ACTION_TYPE.ADD_SERVER,{name:'mock'}).then(server=>{
                let s = {};
                for(let key in this.state.servers){
                    s[key] = this.state.servers[key];
                }
                s[server.sid] = server;
                this.setState({servers:s});
            })
        }
        removeServer(sid){
            Service.fetch(ACTION_TYPE.REMOVE_SERVER,{sid}).then(res=>{
                let s = {},
                    {currentServer,servers} = this.state;
                for(let key in servers){
                    if(sid != key){
                        s[key] = servers[key];
                    }
                }
                if(currentServer === sid){
                    let keys = Object.keys(s);
                    currentServer = keys.length ? keys[keys.length-1] : null;
                }
                this.setState({
                    servers:s,
                    currentServer
                });
            })
        }
        updateServer(sid,payload){
            axios.post('./',payload,(res)=>{
                let s = {};
                for(let key in this.state.servers){

                    s[key] = res.data.id === key ? res.data :this.state.servers[key];
                }
                this.setState({servers:s});
            })
        }
        switchPanel(panel){
            this.setState({panel})
        }
        switchServer(sid){
            this.setState({currentServer:sid});
        }
        render(){
            return <Context.Provider value={{state:this.state,...this.actions}}>
                <Component />
            </Context.Provider>
        }
    }
}

export default withContext;