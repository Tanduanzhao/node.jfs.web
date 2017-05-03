import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
export default class Paper extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSource:[]
	  };
	}
	_loadData(){
		Ajax({
			url:'/paper',
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
			<Table {...this.state}/>
		)
	}
}



class Table extends PureComponent{
	render(){
		return(
			<table className="uk-table">
				<thead>
					<tr>
						<th>论文主题</th>
						<th>上传者</th>
						<th>时间</th>
						<th>附件</th>
						<th>是否查看</th>
					</tr>
				</thead>
				<tbody>
				{
					this.props.dataSource.map((item)=>{
						return(
							<tr key={item._id}>
								<td>{item.title}</td>
								<td>{item.user}</td>
								<td>{item.publishDate}</td>
								<td><a href={item.file.path}><i className="uk-icon-download"></i> {item.file.name}</a></td>
								<td>{!!item.isChecked ? '已查看' : '未查看'}</td>
							</tr>
						)
					})
				}
				</tbody>
			</table>
		)
	}
}
