import React from 'react';
import {connect} from '../connect';

function Header(props){
    const {switchPanel} = props.context,
          {panel} = props.context.state;
    return (
        <div id="header" className='mock-header'style={props.style}>
            <div id="logo">MockX</div>
            <div id="nav" className='nav'>
                <span className={panel=='builder' ?'nav-item active' :'nav-item'} onClick={()=>{switchPanel('builder')}}>SERVER</span>
                <span className={panel=='logger' ?'nav-item active' :'nav-item'} onClick={()=>{switchPanel('logger')}}>LOGGER</span>
            </div>
        </div>
    )
}

export default connect(Header);