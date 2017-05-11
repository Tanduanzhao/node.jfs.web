import React,{PureComponent} from 'react';
import {Link} from 'react-router';
const moment = require('moment');
import {Ajax} from './functions/ajax.js';
export default class PostTable extends PureComponent{
	constructor(props) {
	  super(props);

	  this.state = {
	  	showDropdown:false,
		defaultCategoryName:'全部分类'
	  };
	  this._documentClick = this._documentClick.bind(this);
	}


	_showDropdown(){
		if(this.state.showDropdown) return false;
		this.setState({
			showDropdown:true
		});

		document.addEventListener('click',this._documentClick);

	}

	_toggleCategoryName(name){
		this.setState({
			defaultCategoryName:name
		})
	}
	_hideDropdown(){
		this.setState({
			showDropdown:false
		});
		document.removeEventListener('click',this._documentClick)
	}

	_toggleDropdown(){
		this.state.showDropdown ? this._hideDropdown() : this._showDropdown()

	}
	_stopPropagation(event){
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
	}
	_documentClick(){
		this._hideDropdown();
	}

	_toggleType(id,name){
		this._hideDropdown();
		this._toggleCategoryName(name);
		this.props.toggleType(id);
	}

	_renderNavs(lists){
		if(lists.length==0) return [];
		let nodeLists = [];
		lists.forEach((item)=>{
			nodeLists.push(
				<li key={item._id} data-id={item._id}>
					{
						!!item.childern ? <div className="uk-nav-header">{item.name}</div> : <div onClick={this._toggleType.bind(this,item._id,item.name)}>{item.name}</div>
					}
					{
						item.children.length !=0 ? <ul>{this._renderNavs(item.children)}</ul> : null
					}
				</li>
			)

		})
		return nodeLists;
	}


	render(){
		// alert(this.props.navs.length);
		let navs = this._renderNavs(this.props.navs);
		navs.push(<li key={'uncategory'}>
			<div onClick={this._toggleType.bind(this,0,'未分类')}>未分类</div>
		</li>)

		return(
			<table className="uk-table uk-table-striped uk-table-hover uk-form">
				<thead>
			        <tr>
			            <th>文章标题</th>
			            <th width="10%">发布用户</th>
			            <th width="20%">发布时间</th>
			            <th width="20%">
			            	<div className={`uk-dropdown-nav uk-button-dropdown${this.state.showDropdown ? ' uk-open' : ''}`} onClick={this._toggleDropdown.bind(this)}>
			            		<button className="uk-button uk-button-link">{this.state.defaultCategoryName} <i className="uk-icon-caret-down"></i></button>
			            		<div onClick={this._stopPropagation.bind(this)} className="uk-dropdown" style={{width:'250px',height:'400px',overflow:'auto'}}>
			            			<ul className="uk-nav">
			            				{navs.map((item)=>item)}
			            			</ul>
			            		</div>
			            	</div>
			            </th>
			            <th width="15%"></th>
			        </tr>
			    </thead>
		    	{
		    		this.props.dataSources.length === 0 ? null : <Main {...this.props} dataSources={this.props.dataSources}/>
		    	}
			</table>
		)
	}
}

class Main extends PureComponent{
	_delAction(id){
		this.props.delAction(id);
	}
	render(){
		return(
			<tbody>
				{
					this.props.dataSources.map((ele,index)=>{
		    			return (
		    				<tr key={ele._id}>
		    					<td><Link to={`/index/post/edit/${ele._id}`}>{ele.title}</Link></td>
		    					<td>{ele.publishUser}</td>
		    					<td>{moment(ele.publishDate).format('YYYY-MM-DD HH:mm:ss')}</td>
		    					<td>{(ele.typeId && ele.typeId.name) || '未分类' }</td>
		    					<td>
		    						<Link className="uk-button uk-button-mini" to={`/index/post/edit/${ele._id}`}><i className="uk-icon-edit"></i>编辑</Link>
		    						<a href="javascript:void(0)" className="uk-button uk-button-mini uk-margin-left uk-button-danger" onClick={this._delAction.bind(this,ele._id)}><i className="uk-icon-trash">删除</i></a>
		    					</td>
		    				</tr>
		    			)
		    		})
				}
			</tbody>
		)
	}
}
