import React from 'react';
import {connect} from '../connect';

import Builder from './Builder';
import Logger from './Logger';


function Main(props){
    console.log(props);
    return <div style={{'marginLeft':'100px'}}>
        {props.context.state.panel == 'builder' ? <Builder/> : <Logger/>}
    </div>
}

export default connect(Main)