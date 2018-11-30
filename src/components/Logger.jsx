import React from 'react';
import {connect} from '../connect';
import Tab,{TabPane} from './Tab';
import Collapse from './Collapse';

//全局的Service
const {ACTION_TYPE} = Service;

class Logger extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            server:null,
            logs:[]
        }
    }
    componentDidMount(){
        const sid = this.state.server;
        sid && this.queryLogAll(sid);
    }
    componentWillReceiveProps({context}){
        console.log(context);
        let {currentServer} = context.state;
        if(!currentServer){
            this.setState({
                server:null,
            });
        }else{
            this.setState({
                server:currentServer
            });
            if(currentServer !== this.state.server){
                //查询并更新当前server的Interface列表
                this.queryLogAll(currentServer);
            }
        }
    }
    queryLogAll(currentServer){
        Service.fetch(ACTION_TYPE.QUERY_REQUEST_LOG,{sid:currentServer}).then(data=>{
            this.setState({
                logs:data
            });
        },err=>{
            console.log(err);
        });
    }
    format(str){
        return JSON.stringify(JSON.parse(str),null,4).replace(/\n/g,'<br>').replace(/\s/g,'&nbsp;')
    }
    buildList(){
        const {logs} = this.state;
        const items = logs.map(log=>{
            return <div key={log.lid} className='log-item'>
                <Collapse
                    head={
                    <div className='mock-log-head'>
                        <span className='left'>
                            <span className='method-name' data-method={log.method} >{log.method.toUpperCase()}</span>
                            <span className='url'>{log.url}</span>
                        </span>
                        <span className='date'>{new Date(Number(log.time)).toLocaleString()}</span>
                    </div>
                    } 
                >
                    <Tab defaultActiveKey='1'>
                        <TabPane tab='request headers' key='1'>
                            <div className='log-textarea req-header' dangerouslySetInnerHTML = {{ __html: this.format(log.req_header)}}/>
                        </TabPane>
                        <TabPane tab='request body' key='2'>
                            <div className='log-textarea req-header' dangerouslySetInnerHTML = {{ __html: this.format(log.req_body)}}/>
                        </TabPane>
                        <TabPane tab='response header' key='3'>
                            <div className='log-textarea req-header' dangerouslySetInnerHTML = {{ __html: this.format(log.res_header)}}/>
                        </TabPane>
                        <TabPane tab='response body' key='4'>
                            <div className='log-textarea req-header' dangerouslySetInnerHTML = {{ __html: this.format(log.res_body)}}/>
                        </TabPane>
                    </Tab>
                </Collapse>
            </div>
        });
        return items.length == 0 ? null : items;
    }
    render(){
        if(!this.state.server){
            return <></>
        }
        return <div className={this.props.className}>
            <div className='logs'>
                {this.buildList()}
            </div>
        </div>
    }
}

export default connect(Logger);