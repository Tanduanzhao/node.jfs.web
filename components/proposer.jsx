import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class Proposer extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSource:[]
	  };
	}
	_loadData(){
		Ajax({
			url:'/proposer',
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSource:res.datas
			})
		})
	}
	componentDidMount() {
		this._loadData()
	}
	render(){
		console.log(this.state.dataSource,'state');
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