import React from 'react';

export default class Input extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value:props.value
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    handleInputChange(){
        const value = this.inputEl.value;
        this.setState({value});
        this.props.onUpdate(this.props.index,value);
    }
    handleKeyDown(){
        //TODO
        
    }
    shouldComponentUpdate(nextProps,nextState){
        const {value} = this.state;
        if(value !== nextProps.value || value !== nextState.value){
            return true;
        }
        return false;
    }
    render(){
        return <input
                placeholder={this.props.placeholder}
                ref={el => {this.inputEl=el}} 
                type="text" 
                onChange={this.handleInputChange}
                value={this.state.value}
                onKeyDown={this.handleKeyDown}
            />
    }
}