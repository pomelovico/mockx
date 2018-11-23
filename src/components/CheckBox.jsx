import React from 'react';

export default class CheckBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked:props.checked
        }
        this._elID = Math.random();
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        const checked = e.target.checked;
        this.setState({checked});
        this.props.onChange(checked);
    }
    componentWillReceiveProps({checked}){
        if(this.state.checked != checked){
            this.setState({checked});
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        const currentStateChecked = this.state.checked;
        if(nextProps.checked !== currentStateChecked || nextState.checked !== currentStateChecked){
            return true;
        }
        return false;
    }
    render(){
        return <span>
            <label htmlFor={this._elID}>
            <input 
                id={this._elID} 
                type='checkbox' 
                className='checkbox' 
                checked={this.state.checked}
                onChange={this.handleChange}
            />
            {this.props.children}
            </label>
        </span>
    }
}