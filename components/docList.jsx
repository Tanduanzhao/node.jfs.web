import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class DocList extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	list:[]
	  };
	}

	_loadData(){
		Ajax({
			url:'/docs',
			method:'GET'
		}).then((res)=>{
			this.setState({
				list:res.datas
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
										<td>{item.contact}</td>
										<td>{item.address}</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
			</div>
		)
	}
}