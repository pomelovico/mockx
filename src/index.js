import React from 'react';
import ReactDOM from 'react-dom';

import App from './app.jsx';
// import App2 from './app2.js';
import "./styles/main.css";

function run(){
    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );
}

run();

if(module.hot){
    module.hot.accept('./app.jsx',()=>{
        run();
    })
}