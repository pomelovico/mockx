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

class Builder extends React.Component{
    constructor(props){
        super(props);
        let {servers,currentServer} = props.context.state;
        this.state = {
            server:currentServer !== null ? servers[currentServer] : {sid:null},
            interfaces:[],
            currentInterfaceIndex:null
        }
    }
    componentDidMount(){
        const {sid} = this.state.server;
        sid && this.queryInterfaceAll(sid);
    }
    queryInterfaceAll(sid){
        Service.fetch(ACTION_TYPE.QUERY_INTERFACE_ALL,{sid}).then(data=>{
            this.setState({
                interfaces:data,
                currentInterfaceIndex:data.length ? 0 : null
            })
        }).catch((err)=>{console.log(err)});
    }
    componentWillReceiveProps({context}){
        let {servers,currentServer} = context.state;
        if(!currentServer){
            return;
        }
        if(currentServer !== this.state.server.sid){
            this.setState({
                server:servers[currentServer],
                interfaces:[],
                currentInterfaceIndex:null
            });
            this.queryInterfaceAll(currentServer);
        }
    }
    render(){
        const {interfaces,server,currentInterfaceIndex} = this.state;
        if(!server.sid){
            return null;;
        }
        return <div>
            <div className="m-left">
                <div><Input  name='server-name' value={server.name}  /> <button>run</button></div>
                <div>localhost:<Input name='port' value={server.port}  /> / <Input  name='prefix' value={server.prefix} placeholder="prefix"/></div>
                <DynamicItems 
                    data={interfaces} 
                    enableCheck={false}
                    onRemove={(index)=>{console.log('remove API '+ index)}}
                    onAdd={()=>{console.log('add API')}}
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