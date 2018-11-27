import React from 'react';
import {connect} from '../connect';

import Builder from './Builder';
import Logger from './Logger';
import classNames from 'classnames';


function Main(props){
    let {panel} = props.context.state;
    return <div className='mock-main'>
        <Builder className={classNames('content',{active:panel == 'builder'})}/> 
        <Logger className={classNames('content',{active:panel == 'logger'})}/>
    </div>
}

export default connect(Main)