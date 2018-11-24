import React from 'react';
import {connect} from '../connect';
class Logger extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return <div className={this.props.className}>
            Logger
        </div>
    }
}

export default connect(Logger);