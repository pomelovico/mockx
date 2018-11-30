import React from "react"

class Collapse extends React.Component{
    constructor(props){
        super(props);
        this.isCollapse = true;
        this.switchVisiable = this.switchVisiable.bind(this);
    }
    componentDidMount(){
        this.hide();
    }
    show(){
        this.body.style.display = 'block';
    }
    hide(){
        this.body.style.display = 'none';
    }
    switchVisiable(){
        this.isCollapse = !this.isCollapse;
        this.isCollapse ? this.hide() :this.show();
    }
    render(){
        return <span className='collapse'>
            <div className='head' onClick={this.switchVisiable}>
                {this.props.head}
            </div>
            <div ref={ el =>{this.body = el}}>
                {this.props.children}
            </div>
        </span>
    }
}

export default Collapse