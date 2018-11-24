import React from 'react';

import Tab,{TabPane} from './Tab';
import DynamicItems from './DynamicItems';
import Input from './Input';

import {throttle,debounce} from '../utils';

const {ACTION_TYPE} = Service;

class APIEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.cache = {};
        this._updateInterface = debounce((payload)=>{
            Service.fetch(ACTION_TYPE.UPDATE_INTERFACE,payload);
        },500);
    }
    componentDidMount(){
        let {id} = this.props;
        id && this.queryInterfaceMore(id);
    }
    resolveParams(str,partten){
        return !str ? [] : str.split(partten).map(value=>{
            return {
                value,
                enable:true
            }
        });
    }
    queryInterfaceMore(id){
        Service.fetch(ACTION_TYPE.QUERY_INTERFACE_ONE,{id}).then(data=>{
            let req_params = this.resolveParams(data.req_params,'&'),
                req_body = this.resolveParams(data.req_body,'&');
            let temp = {...data,req_body,req_params};
            this.cache[temp.id] = temp;//缓存
            this.setState(temp);
        });
    }
    componentWillReceiveProps(nextProps){
        if(this.state.id != nextProps.id){
            let cache = this.cache[nextProps.id];
            if(cache){
                this.setState(cache);
                return;
            }
            nextProps.id && this.queryInterfaceMore(nextProps.id);
        }
    }
    //字段，值，索引，操作（更新update，删除remove，添加add，同步数据库）
    updateAPI(filed,operation,index,value){
        //TODO
        console.log(filed,operation,index,value);
        switch(operation){
            case 'update':this.update(filed,index,value);break;
            case 'add':this.add(filed);break;
            case 'remove':this.remove(filed,index);
        }
    }
    update(filed,index,value){
        let temp = this.state[filed].map((item,key)=>{
            if(key === index){
                return {...item,value};
            }
            return item;
        })
        this.setState({
            [filed]:temp
        });
        this._updateInterface({
            [filed]:temp.map(t=>t.value).join('&'),
            id:this.state.id
        });
    }
    add(filed){
        let arr = this.state[filed];
        if(Object.prototype.toString.call(arr) !== '[object Array]'){
            arr = [];
        }
        this.setState({
            [filed]:arr.concat({enable:true,value:''})
        });
    }
    remove(filed,index){
        let arr = this.state[filed];
        let filterd = arr.filter((item,key)=>{
            return key !== index;
        });
        Service.fetch(ACTION_TYPE.UPDATE_INTERFACE,{
            id:this.state.id,
            [filed]:filterd.map(t=>t.value).join('&')
        }).then(res=>{
            this.setState({
                [filed]:filterd
            })
        }).catch(()=>{})
    }
    //字段启用与关闭（程序应用状态，不同步数据库）
    handleSwitchEnabledFiled(filed,operation,index,enabled){
        //TODO
        console.log(filed,operation,index,enabled);
        let data =this.state[filed].slice();
        data[index].enable = enabled;
        this.setState({
            [filed]:data
        });
    }
    updateInterfaceBase(payload){
        this.props.onUpdate(payload);
    }
    render(){
        if(!this.props.id){
            return <></>;
        }
        return <div className='m-right'>
            <div>
                <select name="request-method" onChange={(e)=>{this.updateInterfaceBase({id:this.state.id,method:e.target.value})}} value={this.props.method}>
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="head">HEAD</option>
                    <option value="put">PUT</option>
                </select>
                / <Input value={this.props.path} onUpdate={(value)=>{this.updateInterfaceBase({id:this.state.id,path:value})}}/>
            </div>
            <div>
                <Tab defaultActiveKey='1'>
                    <TabPane tab='REQUEST' key='1'>
                        <div>
                            <Tab defaultActiveKey="1">
                                <TabPane tab='Params' key='1'>
                                    <DynamicItems 
                                        data={this.state.req_params}
                                        onRemove={index=>this.updateAPI('req_params','remove',index)}
                                        onAdd={()=>this.updateAPI('req_params','add')}
                                        onUpdate={(value,index)=>this.updateAPI('req_params','update',index,value)}
                                        onCheck={(index,checked)=> this.handleSwitchEnabledFiled('req_params','update',index,checked)}
                                    >
                                        <Input />
                                    </DynamicItems>
                                </TabPane>
                                <TabPane tab='Body' key='2'>
                                <DynamicItems 
                                        data={this.state.req_body} 
                                        onRemove={index=>this.updateAPI('req_body','remove',index)}
                                        onAdd={()=>this.updateAPI('req_body','add')}
                                        onUpdate={(value,index)=>this.updateAPI('req_body','update',index,value)}
                                        onCheck={(index,checked)=> this.handleSwitchEnabledFiled('req_body','update',index,checked)}
                                    >
                                        <Input />
                                    </DynamicItems>
                                </TabPane>
                                <TabPane tab='Headers' key='3'>
                                    input header:<input type='text'/>
                                </TabPane>
                            </Tab>
                        </div>
                    </TabPane>
                    <TabPane tab='RESPONE' key='2'>
                        <div>
                            <Tab defaultActiveKey="1">
                                <TabPane tab='Body' key='1'>
                                    input body:<input type='text'/>
                                </TabPane>
                                <TabPane tab='Headers' key='2'>
                                    input header:<input type='text'/>
                                </TabPane>
                            </Tab>
                        </div>
                    </TabPane>
                </Tab>
            </div>
        </div>
    }
}

export default APIEditor;