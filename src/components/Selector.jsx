import React from "react"

class Selector extends React.Component{
    constructor(props){
        super(props);
        let {defaultValue} = props;
        this.state = {
            defaultValue,
            currentValue:defaultValue,
            status:'hide'
        }
        this.listenOnBody = this.listenOnBody.bind(this);
    }
    listenOnBody(e){
        this.hide();
    }
    componentWillReceiveProps(nextProps){
        if(this.currentValue !== nextProps.defaultValue){
            this.setState({
                currentValue:nextProps.defaultValue
            });
        }
    }
    componentDidMount(){
        document.body.addEventListener('click',this.listenOnBody);
        this.dropdownEl.style.display = 'none';
    }
    handleChange(value){
        this.props.onChange(value);
        this.setState({
            currentValue:value
        });
    }
    buildList(){
        const {children} = this.props;
        return React.Children.map(children,(child)=>{
            return React.cloneElement(child,{
                ...child.props,
                onClick:(value)=>{this.handleChange(value)}
            })
        })
    }
    show(){
        this.dropdownEl.style.display = 'block';
        this.setState({status:'show'});
    }
    hide(){
        this.dropdownEl.style.display = 'none';
        this.setState({status:'hide'});
    }
    componentWillUnmount(){
        //组件卸载前移除注册的事件
        document.body.removeEventListener('click',this.listenOnBody);
    }
    render(){
        return <span className='selector' >
            <span className='current' onClick={()=>{this.show()}}>
                {this.state.currentValue.toUpperCase()}
                <span className={this.state.status == 'show' ? "arrow up" :"arrow down"}></span>
            </span>
            <div className='drop' ref={ el =>{this.dropdownEl = el}}>
                {this.buildList()}
            </div>
        </span>
    }
}
export function Option({value,onClick,children}){
    return <span className='option' onClick={()=>{onClick(value)}}>
            {children}
        </span>
}
export default Selector