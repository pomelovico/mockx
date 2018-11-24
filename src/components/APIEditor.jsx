import React from 'react';

import Tab,{TabPane} from './Tab';
import DynamicItems from './DynamicItems';
import Axios from 'axios';
import Input from './Input';

const {ACTION_TYPE} = Service;

class APIEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {}; 
        this.handleRequestMethod = this.handleRequestMethod.bind(this);
    }
    componentDidMount(){
        this.fetchAPIDetails(this.props.id);
    }
    resolveParams(str,partten){
        return !str ? [] : str.split(partten).map(value=>{
            return {
                value,
                enable:true
            }
        });
    }
    fetchAPIDetails(id){
        Service.fetch(ACTION_TYPE.QUERY_INTERFACE_ONE,{id}).then(data=>{
            let req_params = this.resolveParams(data.req_params,'&'),
                req_body = this.resolveParams(data.req_body,'&');
            this.setState({...data,req_body,req_params});
        });
    }
    handleRequestMethod(e){
        this.setState({
            method:e.target.value
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.state.id != nextProps.id){
            this.fetchAPIDetails(nextProps.id);
        }
    }
    //字段，值，索引，操作（更新update，删除remove，添加add，同步数据库）
    updateAPI(filed,operation,index,value){
        //TODO
        console.log(filed,operation,index,value);
        this.props.onUpdate(
            
        );
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
    render(){
        if(!this.state.id){
            return <></>;
        }
        return <div className='m-right'>
            <div>
                <select name="request-method" onChange={this.handleRequestMethod} value={this.state.method}>
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="head">HEAD</option>
                    <option value="put">PUT</option>
                </select>
                / <Input value={this.state.path} onUpdate={()=>{}}/>{/* <input type="text" name='path' value='mockme'/> */}
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
                                        onUpdate={(index,value)=>this.updateAPI('req_params','update',index,value)}
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
                                        onUpdate={(index,value)=>this.updateAPI('req_body','update',index,value)}
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