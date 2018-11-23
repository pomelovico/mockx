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
        this.state = {
            server:{
                id:1,
                name:'MockMe',
                por:3000,
                prefix:'',
                api:[
                    {
                        id:'1_32d',
                        path:'login',
                        method:'GET'
                    },
                    {
                        id:'2_32d',
                        path:'signout',
                        method:'GET',
                    }
                ]
            },
            currentAPIIndex:0
        }
    }
    componentDidMount(){
        Service.fetch(ACTION_TYPE.QUERY_INTERFACE_ALL,{sid:'s_1542798569081_9cig'}).then(data=>{
            console.log(data);
            this.setState({
                server:{...this.state.server,api:data}
            })
        })
    }
    render(){
        const {api} = this.state.server;
        return <div>
            <div className="m-left">
                <div><Input  name='server-name' value=''  /> <button>run</button></div>
                <div>localhost:<Input name='port' value='3000'  /> / <Input  name='prefix' value=''/></div>
                <DynamicItems 
                    data={api} 
                    enableCheck={false}
                    onRemove={(index)=>{console.log('remove API '+ index)}}
                    onAdd={()=>{console.log('add API')}}
                >
                    <APIItem onSwitchAPI={(index)=>{
                        this.setState({currentAPIIndex:index});
                    }}/>
                </DynamicItems>
            </div>
            <APIEditor 
                id={api[this.state.currentAPIIndex].id}
                onUpdate={(api)=>{
                    
                }}
            />
        </div>
    }
}

export default connect(Builder);