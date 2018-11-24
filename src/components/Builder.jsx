import React from 'react';
import {connect} from '../connect';

import Input from './Input';
import APIEditor from './APIEditor';

import DynamicItems from './DynamicItems';

//全局的Service
const {ACTION_TYPE} = Service;

function APIItem(props){
    return  <span key={props.id} onClick={()=>{props.onSwitchAPI(props.index)}}>
            {props.method} / {props.path} 
        </span>
}
function ServerInfo({name,port,prefix,...props}){
    return <>
        <div><Input  name='server-name' value={name} onUpdate={(value)=>{props.update({name:value})}}  /> <button>run</button></div>
        <div>
            localhost:<Input name='port' value={port} onUpdate={(value)=>{props.update({port:value})}} /> 
            / 
            <Input  name='prefix' value={prefix} placeholder="prefix" onUpdate={(value)=>{props.update({'prefix':value})}}/>
        </div>
    </>
}

class Builder extends React.Component{
    constructor(props){
        super(props);
        let {servers,currentServer} = props.context.state;
        this.state = {
            server:currentServer !== null ? servers[currentServer] : {sid:null},
            interfaces:[],
            currentInterfaceIndex:null
        }
        this.updateServer = this.updateServer.bind(this)
    }
    componentDidMount(){
        const {sid} = this.state.server;
        sid && this.queryInterfaceAll(sid);
    }
    //查询当前server下的interface列表
    queryInterfaceAll(sid){
        Service.fetch(ACTION_TYPE.QUERY_INTERFACE_ALL,{sid}).then(data=>{
            this.setState({
                interfaces:data,
                currentInterfaceIndex:data.length ? 0 : null
            })
        }).catch((err)=>{console.log(err)});
    }
    removeInterface(index){
        let {interfaces,currentInterfaceIndex} = this.state;
        let id = interfaces[index].id;
        Service.fetch(ACTION_TYPE.REMOVE_INTERFACE,{id}).then(res=>{
            let rest = interfaces.filter((item,key)=>{
                return index != key;
            });
            if(currentInterfaceIndex === index){
                currentInterfaceIndex = rest.length === 0 ? null : rest.length-1
            }
            this.setState({
                interfaces:rest,
                currentInterfaceIndex
            });
        });
    }
    addInterface(){
        let {sid} = this.state.server;
        Service.fetch(ACTION_TYPE.ADD_INTERFACE,{sid}).then(res=>{
            let rest = this.state.interfaces.concat(res);
            this.setState({interfaces:rest,currentInterfaceIndex:rest.length-1});
        })
    }
    componentWillReceiveProps({context}){
        let {servers,currentServer} = context.state;
        if(!currentServer){
            this.setState({
                server:{sid:null},
                interfaces:[],
                currentInterfaceIndex:null
            });
        }else{
            this.setState({
                server:servers[currentServer]
            });
            //查询并更新当前server的Interface列表
            this.queryInterfaceAll(currentServer);
        }
    }
    
    updateServer(payload){
        this.props.context.updateServer({...payload,sid:this.state.server.sid});
    }
    render(){
        const {interfaces,server,currentInterfaceIndex} = this.state;
        if(!this.props.context.state.currentServer){
            return null;;
        }
        return <div>
            <div className="m-left">
                <ServerInfo {...server} update={this.updateServer}/>
                <DynamicItems 
                    data={interfaces} 
                    enableCheck={false}
                    onRemove={(index)=>{this.removeInterface(index);console.log('remove API '+ index)}}
                    onAdd={()=>{this.addInterface();console.log('add API')}}
                >
                    <APIItem onSwitchAPI={(index)=>{
                        this.setState({currentInterfaceIndex:index});
                    }}/>
                </DynamicItems>
            </div>
            {
                currentInterfaceIndex !== null && 
                <APIEditor 
                    id={currentInterfaceIndex !==null ? interfaces[currentInterfaceIndex].id : null}
                    onUpdate={(i)=>{}}
                />
            }
            
        </div>
    }
}

export default connect(Builder);