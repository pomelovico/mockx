import React from 'react';
import {connect} from '../connect';
class Logger extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return "Logger"
    }
}

export default connect(Logger);