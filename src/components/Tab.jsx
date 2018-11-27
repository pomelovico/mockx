import React from 'react';

export class TabPane extends React.Component{
    constructor(props){
        super(props);
        this.name = 'tabpane';
    }
    render(){
        return <>
            {this.props.children}
        </>
    }
}

export default class Tab extends React.Component{
    constructor(props){
        super(props);
        let {children} = props;
        this.state = {
            activePane:props.defaultActiveKey
        }
        this.tabs = children.map(pane=>{
            return {
                title:pane.props.tab,
                key:pane.key
            }
        });
    }
    buildTabTitle(){
        return this.tabs.map(t=>{
            return <span 
                key={t.key} 
                className={this.state.activePane == t.key ? 'tab-head focus': 'tab-head'}
                onClick={()=>{
                    this.setState({
                        activePane:t.key
                    })
                }}
                >{t.title}
            </span>
        });
    }
    render(){
        return <div className='mock-tab'>
            <div className='mock-tab-head'>
                {this.buildTabTitle()}
            </div>
            {this.props.children.map(Pane=>{
                return <div key={Pane.key} className={this.state.activePane == Pane.key ? 'tab-body active' : 'tab-body'}>
                   {Pane}
                </div>
            })}
        </div>
    }
}