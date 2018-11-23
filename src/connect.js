import React from 'react';
import axios from 'axios';

export const Context = React.createContext({a:100});

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
                servers:{
                    1:{name:"Mockkkkk",id:1},
                    2:{name:"SOuth",id:2}
                },
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
            //Async...
            let mock = {
                1:{name:"Moc",id:1},
                2:{name:"SOuth",id:2}
            }
            this.setState({
                servers:mock
            });
            cb && cb(mock);
            axios.get('./',(res)=>{
                this.setState({
                    servers:res.data
                });
                cb && cb(res.data);
            })
        }
        addServer(){
            //Async...
            axios.post('./',{},(res)=>{
                let s = {};
                for(let key in this.state.servers){
                    s[key] = this.state.servers[key];
                }
                s[res.data.id] = res.data;
                this.setState({servers:s});
            })
        }
        removeServer(sid){
            axios.get('./',{sid},()=>{
                let s = {};
                for(let key in this.state.servers){
                    if(sid != key){
                        s[key] = this.state.servers[key];
                    }
                }
                this.setState({servers:s});
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