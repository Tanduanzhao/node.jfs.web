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
								<td>{!!item.replay ? '已处理' : '未处理'}</td>
							</tr>
						)
					})
				}
				</tbody>
			</table>
		)
	}
}
