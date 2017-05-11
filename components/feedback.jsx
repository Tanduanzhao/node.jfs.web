import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
export default class FeedBack extends PureComponent{
	constructor(props) {
	  super(props);

	  this.state = {
	  	dataSource:[]
	  };
	}
	_loadData(){
		Ajax({
			url:'/feedback',
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSource:res.datas
			})
		})
	}
	submit(){
		Ajax({
			url:'/feedback?searchValue='+this.refs.searchValue.value+'&time='+this.refs.time.value,
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSource:res.datas
			})
		})
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
					<a className="uk-button uk-margin-left" type="button" onClick={this.submit.bind(this)}>提交</a>
				</form>
				<Table {...this.state}/>
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
					<th>编号</th>
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
							<td><Link to={`/index/feedback/${item._id}`}>{item._id}</Link></td>
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
