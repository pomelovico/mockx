import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from './CheckBox';

/*
回调函数
onUpdate(index,value)
onAdd()
onRemove(index)
onCheck(index,checked)

属性：
data: Array
enableCheck: Boolean
enableRemove: Boolean
*/

//动态增删组件
class DynamicItems extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:props.data || []
        }
        this.addItem = this.addItem.bind(this);
    }
    buildList(){
        let items = this.state.data.map(this.renderRow.bind(this));
        return items.length ? <ul>{items}</ul> : null;
    }
    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.data});
    }
    renderRow(item,index){
        let child = this.props.children,
            {enableRemove,enableCheck} = this.props;
        return <li key={index}>
            {/* <input 
                type='checkbox'
                checked={item.enable}
                onChange={e => this.props.onSwitchEnable(index,e.target.checked)}
            /> */}
            {enableCheck !== false ? <CheckBox 
                checked={item.enable} 
                onChange={checked => this.props.onCheck(index,checked)} 
            /> : null}
            
            {React.cloneElement(child,
                {
                    onUpdate:this.props.onUpdate,
                    index:index,
                    ...item,
                    ...child.props,
                },
                child.props.children
            )}
            {enableRemove !== false ? <button onClick={()=>{this.removeItem(index)}}>x</button> : null }
        </li>
    }
    addItem(){
        this.props.onAdd();
    }
    removeItem(index){
        this.props.onRemove(index);
    }
    render(){
        let {enableAdd} = this.props;
        return <div>
            {this.buildList()}
            <div>{enableAdd !== false ? <button onClick={this.addItem}>Add</button>  : null} </div>
        </div>
    }
}

DynamicItems.defaultProps = {
    onUpdate:function(){console.log("you'd better override this method !");},
    onAdd:function(){console.log("you'd better override this method !");},
    onRemove:function(){console.log("you'd better override this method !");},
    enableCheck:true,
    enableRemove:true,
    enableAdd:true
}

DynamicItems.propTypes = {
    data:PropTypes.array,
    enableCheck:PropTypes.bool,
    enableRemove:PropTypes.bool
}

export default DynamicItems