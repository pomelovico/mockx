import React from 'react';

import Tab,{TabPane} from './Tab';
import DynamicItems from './DynamicItems';
import Input from './Input';
import Selector,{Option} from './Selector';

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
    resolveParams(data,partten){
        let keys = ['req_params',"req_header",'req_body','res_header'];
        for(let key in data){
            if(~keys.indexOf(key)){
                let str = data[key];
                data[key] = !str ? [] : str.split(partten).map(value=>{
                    return {
                        value,
                        enable:true
                    }
                });
            }
        }
        return data;
    }
    queryInterfaceMore(id){
        Service.fetch(ACTION_TYPE.QUERY_INTERFACE_ONE,{id}).then(data=>{
            this.setState(this.resolveParams(data,'&'));
        }).catch(e=>{
            console.log(e);
        });
    }
    componentWillReceiveProps(nextProps){
        if(this.state.id != nextProps.id){
            nextProps.id && this.queryInterfaceMore(nextProps.id);
        }
    }
    //字段，值，索引，操作（更新update，删除remove，添加add，同步数据库）
    updateAPI(filed,operation,index,value){
        switch(operation){
            case 'update':this.update(filed,index,value);break;
            case 'add':this.add(filed);break;
            case 'remove':this.remove(filed,index);
        }
    }
    update(filed,index,value){
        let temp = value;
        if(filed !='res_body'){
            temp = this.state[filed].map((item,key)=>{
                if(key === index){
                    return {...item,value};
                }
                return item;
            })
        }
        this.setState({
            [filed]:temp
        });
        this._updateInterface({
            [filed]: Array.isArray(temp)?temp.map(t=>t.value).join('&'):temp,
            id:this.state.id,
            sid:this.state.sid
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
            sid:this.state.sid,
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
        this.props.onUpdate({...payload,sid:this.state.sid});
    }
    render(){
        if(!this.props.id){
            return <></>;
        }
        return <div className='m-right'>
            <div style={{paddingBottom:'15px',borderBottom:"1px solid #345"}}>
                <Selector defaultValue="get" onChange={value=>{this.updateInterfaceBase({id:this.state.id,method:value.toLowerCase()})}}>
                    <Option value="get" >GET</Option>
                    <Option value="post">POST</Option>
                    <Option value="put">PUT</Option>
                    <Option value="delete">DELETE</Option>
                </Selector>
                 &nbsp;&nbsp;&nbsp;&nbsp;/ <Input className='path' value={this.props.path} onUpdate={(value)=>{this.updateInterfaceBase({id:this.state.id,path:value})}}/>
            </div>
            <div class='res-req'>
                <Tab defaultActiveKey='1'>
                    <TabPane tab='REQUEST' key='1'>
                        <div className='sub-tab'>
                            <Tab defaultActiveKey="1">
                                <TabPane tab='params' key='1'>
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
                                <TabPane tab='body' key='2'>
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
                                <TabPane tab='headers' key='3'>
                                    <DynamicItems 
                                        data={this.state.req_header}
                                        onRemove={index=>this.updateAPI('req_header','remove',index)}
                                        onAdd={()=>this.updateAPI('req_header','add')}
                                        onUpdate={(value,index)=>this.updateAPI('req_header','update',index,value)}
                                        onCheck={(index,checked)=> this.handleSwitchEnabledFiled('req_header','update',index,checked)}
                                    >
                                        <Input />
                                    </DynamicItems>
                                </TabPane>
                            </Tab>
                        </div>
                    </TabPane>
                    <TabPane tab='RESPONE' key='2'>
                        <div className='sub-tab'>
                            <Tab defaultActiveKey="1">
                                <TabPane tab='body' key='1'>
                                    <textarea 
                                        className='res_body-textarea'
                                        value={this.state.res_body || ''}
                                        onChange={ e => {this.updateAPI('res_body','update',0,e.target.value)}}
                                    ></textarea>
                                </TabPane>
                                <TabPane tab='headers' key='2'>
                                    <DynamicItems 
                                        data={this.state.res_header}
                                        onRemove={index=>this.updateAPI('res_header','remove',index)}
                                        onAdd={()=>this.updateAPI('res_header','add')}
                                        onUpdate={(value,index)=>this.updateAPI('res_header','update',index,value)}
                                        onCheck={(index,checked)=> this.handleSwitchEnabledFiled('res_header','update',index,checked)}
                                    >
                                        <Input />
                                    </DynamicItems>
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