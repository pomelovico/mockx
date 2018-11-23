import React from 'react';
import {connect} from '../connect';

function Header(props){
    const {switchPanel} = props.context;
    return (
        <div id="header" className='mock-header'style={props.style}>
            <div id="logo">MockX</div>
            <div id="nav" className='nav'>
                <span className="nav-item" onClick={()=>{switchPanel('builder')}}>Server</span>
                <span className="nav-item" onClick={()=>{switchPanel('logger')}}>Logger</span>
            </div>
        </div>
    )
}

export default connect(Header);