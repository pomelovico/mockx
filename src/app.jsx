import React from 'react';

import Header from './components/Header';
import Sider from './components/Sider';
import Content from './components/Content';

import withContext from './connect';

class App extends React.Component{
    constructor(props){
        super(props);
    }
    render (){
        return <div>
            <Header style={{backgroundColor:'#123'}}>
                <div id="logo">Logo</div>
            </Header>
            <Sider/>
            <Content/>
        </div>
    }
}

export default withContext(App)