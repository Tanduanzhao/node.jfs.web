import React,{PureComponent} from 'react';
const moment = require('moment');
import {Link} from 'react-router';
export default class CategoryTable extends PureComponent{
	_delAction(id){
		console.log(id);
		this.props.delAction(id);
	}
	showChildNode(event){
		let ele = event.target;

		if(!ele.parentNode.nextSibling){
			return false;
		}
		if(ele.parentNode.nextSibling.clientHeight <= 0){
			event.target.parentNode.nextSibling.style.display = 'block';
		}else{
			event.target.parentNode.nextSibling.style.display = 'none';
		}
		
	}
	renderNav(props){
		let nodeList = [];

		if(props.length == 0){

			return nodeList;
		}
		for(let item in props){
				nodeList.push(
					<li key={props[item]._id}>
						<div className="uk-clearfix">
							<a className="uk-float-left" href="javascript:void(0);" onClick={(event)=>this.showChildNode(event)}>{props[item].name}</a>
							<span className="uk-float-right"><Link className="uk-button uk-button-mini" to={`/index/category/edit/${props[item]._id}`}><i className="uk-icon-edit"></i>修改</Link>
		    						<a className="uk-button uk-button-mini uk-margin-left uk-button-danger" href="javascript:void(0)" onClick={this._delAction.bind(this,props[item]._id)}><i className="uk-icon-trash"></i>删除</a></span>
						</div>
						{
							!!props[item].children.length ?
								<ul className="uk-list">
									{this.renderNav(props[item].children)}
								</ul> : null
						}
					</li>
				)
		}
		return nodeList;
	}
	render(){
		let node = this.renderNav(this.props.dataSources);
		console.log(node);
		return(
			<ul className="uk-list">
				{
					!node.length ? null : node.map((item)=>{
						return item;
					})
				}
			</ul>

		)
	}
}

class Main extends PureComponent{
	
	render(){
		return(
			<tbody>
				{
					this.props.dataSources.map((ele,index)=>{
		    			return (
		    				<tr key={ele._id}>
		    					<td>{ele.name}</td>
		    					<td>{moment(ele.date).format('YYYY/MM/DD')}</td>
		    					<td>{(ele.parentId && ele.parentId.name) || '首页'}</td>
		    					<td>
		    						<Link className="uk-button uk-button-mini" to={`/index/category/edit/${ele._id}`}><i className="uk-icon-edit"></i>修改</Link>
		    						<a className="uk-button uk-button-mini uk-margin-left uk-button-danger" href="javascript:void(0)" onClick={this._delAction.bind(this,ele._id)}><i className="uk-icon-trash"></i>删除</a>
		    					</td>
		    				</tr>
		    			)
		    		})
				}
			</tbody>
		)
	}
}