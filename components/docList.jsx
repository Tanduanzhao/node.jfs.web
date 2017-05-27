import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
import Pagination from './pagination.jsx';
export default class DocList extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
		  list:[],
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
			url:'/docs?page=' + this.state.page,
			method:'GET'
		}).then((res)=>{
			this.setState({
				list:res.datas,
				totalPage:res.page.totalPage,
				page:res.page.page
			})
		})
	}

	componentDidMount() {
		this._loadData();
	}
	render() {
		return(
			<div>
				<table className="uk-table uk-table-striped uk-table-hover">
					<thead>
						<tr>
							<th>投稿人</th>
							<th>投稿日期</th>
							<th>投稿附件</th>
							<th>单位名称</th>
							<th>联系方式</th>
							<th>地址</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.list.map((item)=>{
								return (
									<tr key={item._id}>
										<td>{item.user}</td>
										<td>{item.publishDate}</td>
										<td><a download={item.file.name} href={`${item.file.path}`}><i className="uk-icon-download"></i> {item.file.name}</a></td>
										<td>{item.unit}</td>
										<td>{item.contact}</td>
										<td>{item.address}</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
				{
					!!this.state.totalPage && <Pagination pageChange={this._pageChange.bind(this)} totalPage={this.state.totalPage} page={this.state.page}/>
				}
			</div>
		)
	}
}