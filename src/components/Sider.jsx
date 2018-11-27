import React from 'react';
import {connect} from '../connect';

function ServerIntem(){
    return <li key={sid} className={ sid == this.props.context.state.currentServer ? 'focus' : ""}>
    <span onClick={()=>this.switchServer(sid)}>{name}</span>
    <button onClick={()=>{this.removeServer(sid)}}>x</button>
</li>
}

class Sider extends React.Component{
    constructor(props,context){
        super(props,context);

        //bind
        this.switchServer = this.switchServer.bind(this);
    }
    componentWillReceiveProps({context}){
    }
    switchServer(sid){
        //通知
        this.props.context.switchServer(sid);
    }
    removeServer(sid){
        this.props.context.removeServer(sid);
    }
    buildServerList(servers){
        let frags = [];
        for(var key in servers){
            let server = servers[key];
            const {sid,name} = server;
            frags.push(<li key={sid} className={ sid == this.props.context.state.currentServer ? 'dynamic-item active' : "dynamic-item"}>
            <span onClick={()=>this.switchServer(sid)}>{name}</span>
            <button className='btn btn-remove' onClick={()=>{this.removeServer(sid)}}>+</button>
        </li>);
        }
        return frags.length ? <ul>{frags}</ul> : null;
    }
    render(){
        const {state,addServer} = this.props.context;
        return (<div className='mock-sider'>
                <div className="dynamic-list">
                    {this.buildServerList(state.servers)}
                    <button className='btn btn-add' onClick={(()=>{addServer()})}>+</button>
                </div>
        </div>
        )
    }
}

export default connect(Sider)