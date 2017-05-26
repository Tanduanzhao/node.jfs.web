import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
import Pagination from './pagination.jsx';
export default class FeedBack extends PureComponent{
	constructor(props) {
	  super(props);

	  this.state = {
	  	dataSource:[],
		  page:1
	  };
	}
	_pageChange(num){
		this.setState({
			page:num
		},()=>{
			this._loadData();
		});
	}
	_loadData(){
		Ajax({
			url:'/feedback?page=' + this.state.page+'&searchValue='+this.refs.searchValue.value+'&time='+this.refs.time.value,
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSource:res.datas,
				totalPage:res.totalPage,
				page:res.page.page
			})
		})
	}
	search(){
		this.setState({
			page:1
		},()=>{
			this._loadData();
		});
	}
	componentDidMount() {
		this._loadData();
	}
	render(){
		return(
			<div>
				<form className="uk-form">
					<div className="uk-form-icon">
						<i className="uk-icon-search"></i>
						<input ref="searchValue" type="text" placeholder=""/>
					</div>
					<div className="uk-form-icon uk-margin-left">
						<i className="uk-icon-calendar"></i>
						<input ref="time" type="text" data-uk-datepicker="{format:'YYYY-MM-DD'}"/>
					</div>
					<a className="uk-button uk-margin-left" type="button" onClick={this.search.bind(this)}>搜索</a>
				</form>
				<Table {...this.state}/>
				{
					!!this.state.totalPage && <Pagination pageChange={this._pageChange.bind(this)} totalPage={this.state.totalPage} page={this.state.page}/>
				}
			</div>
		)
	}
}



class Table extends PureComponent{
	render(){
		return(
			<table className="uk-table">
				<thead>
				<tr>
					<th>身份证号</th>
					<th>投诉标题</th>
					<th>时间</th>
					<th>处理状态</th>
				</tr>
				</thead>
				<tbody>
				{
					this.props.dataSource.map((item)=>{
						return(
						<tr key={item._id}>
							<td><Link to={`/index/feedback/${item._id}`}>{item.cardID}</Link></td>
							<td>{item.title}</td>
							<td>{item.publishDate}</td>
							<td>{
								(function(){
									if(item.status === 2){
										return "已处理"
									}else if(item.status === 1){
										return "处理中"
									}else{
										return "未处理"
									}
								})()
							}</td>
						</tr>
						)
					})
				}
				</tbody>
			</table>
		)
	}
}
