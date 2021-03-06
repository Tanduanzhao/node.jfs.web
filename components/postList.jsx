import React,{PureComponent} from 'react';
import PostTable from './postTable.jsx';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
import Pagination from './pagination.jsx';
export default class PostList extends PureComponent{
	constructor(props) {
	  super(props);

	  this.state = {
	  	dataSources:[],
	  	navs:[],
	  	page:1
	  };
	}
	_delAction(id){
		Ajax({
			url:`/admin/post/${id}`,
			method:'DELETE'
		}).then((res)=>{
			if(!res.status){
				UIkit.notify(res.message,{pos:'bottom-right',status:'danger'});
			}else{
				UIkit.notify(res.message,{pos:'bottom-right',status:'success'});
				this._loadPostList();
			}
		})
	}

	_pageChange(num){
		this.setState({
			page:num
		},()=>{
			this._loadPostList();
		});
	}
	_loadPostList(){
		let url= '/admin/post?page=' + this.state.page+'&searchValue='+this.refs.searchArticle.value;
		if(this.state.categoryId!=undefined){
			url += '&cid='+this.state.categoryId
		}
		Ajax({
			url:url,
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSources:res.datas,
				totalPage:res.totalPage,
				page:res.page
			});
		})
	}
	_toggleType(id){
		this.setState({
			categoryId:id,
			page:1
		},this._loadPostList)
	}
	_loadNavs(){
		Ajax({
			url:'/admin/category',
			method:'GET'
		}).then((res)=>{
			if(res.status == 1){
				this.setState({
					navs : res.nav
				})
			}
		})
	}
	search(){
		this.setState({
			page:1
		},()=>{
			this._loadPostList();
		});
	}
	componentDidMount() {
		this._loadPostList();
		this._loadNavs();
	}

	render(){
		return(
			<div>
				<form className="uk-form">
					<Link className="uk-button uk-button-primary" to="/index/post/add">添加文章</Link>
					<div className="uk-form-icon  uk-margin-left">
						<i className="uk-icon-search"></i>
						<input ref="searchArticle" type="text" placeholder=""/>
					</div>
					<a className="uk-button uk-margin-left" type="button" onClick={this.search.bind(this)}>搜索</a>
				</form>
				<PostTable toggleType={this._toggleType.bind(this)} navs={this.state.navs} delAction={this._delAction.bind(this)} dataSources={this.state.dataSources}/>
				{
					!!this.state.totalPage && <Pagination pageChange={this._pageChange.bind(this)} totalPage={this.state.totalPage} page={this.state.page}/>
				}
			</div>
		)
	}
}
