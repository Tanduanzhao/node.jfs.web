import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
import Pagination from './pagination.jsx';
export default class Proposer extends PureComponent{
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
			url:'/proposer?page=' + this.state.page,
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSource:res.datas,
				totalPage:res.page.totalPage,
				page:res.page.page
			})
		})
	}
	componentDidMount() {
		this._loadData()
	}
	render(){
		console.log(this.state.dataSource,'state');
		return(
			<div>
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
						<th>标题</th>
						<th width="40%">申请表格</th>
						<th width="20%">申请时间</th>
					</tr>

				</thead>
				<tbody>
					{
						this.props.dataSource.map((item)=>{
							return (
								<tr key={item._id}>
									<td>{item.title}</td>
									<td><a download={item.title+'_'+ item.file.name} href={`${item.file.path}`}><i className="uk-icon-download"></i> {item.file.name}</a></td>
									<td>{item.publishDate}</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		)
	}
}