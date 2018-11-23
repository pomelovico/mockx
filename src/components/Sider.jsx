import React from 'react';
import {connect} from '../connect';

class Sider extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            current: null
        }

        //bind
        this.switchServer = this.switchServer.bind(this);
    }
    switchServer(id){
        return ()=>{
            this.setState({current:id});
            //通知
            this.props.context.switchServer(id);
        }
    }
    buildServerList(servers){
        let frags = [];
        for(var key in servers){
            let server = servers[key];
            const {id,name} = server;
            frags.push(<li key={id} className={ id == this.props.context.state.currentServer ? 'focus' : ""}>
            <span onClick={this.switchServer(id)}>{name}</span>
        </li>);
        }
        return frags.length ? <ul>{frags}</ul> : null;
    }
    render(){
        const {state,addServer} = this.props.context;
        return (<div className='mock-sider'>
                {this.buildServerList(state.servers)}
                <button onClick={(()=>{addServer()})}>Add</button>
        </div>
        )
    }
}

export default connect(Sider)