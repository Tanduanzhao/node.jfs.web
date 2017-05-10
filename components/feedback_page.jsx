import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class FeedBackPage extends React.Component{
	constructor(props) {
	  super(props);

	  this.state = {
	  	data:{}
	  };
	}
	_loadData(){
		Ajax({
			url:'/feedback/'+this.props.params.id,
			method:'GET'
		}).then((res)=>{
			this.setState({
				data:res.datas
			})
		})
	}
	_subReplay(){
		if(!this.state.data.replay || !this.state.data.replay.length){return false};
		Ajax({
			url:'/feedback/'+this.props.params.id,
			datas:{
				replay:this.state.data.replay,
				status:+this.state.data.status
			}
		}).then((res)=>{
			if(res.status==1){
				alert(res.message);
				this.props.router.goBack();
			}
		})
	}
	_replayChange(){
		let _o = this.state.data;
		_o.replay = this.refs.replay.value;
		this.setState({
			data:_o
		})
	}
	_statusOnChange(){
		let _d = this.state.data;
		_d.status = this.refs.status.value;
		this.setState({
			data:_d
		})
	}
	componentDidMount() {
		this._loadData();
	}
	render(){
		return(
			<article className="uk-article uk-form">
				<h1 className="uk-article-title">{this.state.data.title}</h1>
				<p className="uk-article-meta">{this.state.data.publishDate} | {this.state.data.user} | {this.state.data.contact} | {this.state.data.email} | {this.state.data.address}</p>
				<p className="uk-article-lead">{this.state.data.content}</p>
				<p>
					<textArea cols={80} rows={5} ref="replay" onChange={this._replayChange.bind(this)} value={this.state.data.replay} placeholder="还没有回复哦!"></textArea>
				</p>
				<p>
					<select ref="status" value={this.state.data.status} onChange={this._statusOnChange.bind(this)}>
						<option value="0">未处理</option>
						<option value="1">处理中</option>
						<option value="2">已处理</option>
					</select>
				</p>
				<p><button className="uk-button uk-button-primary" onClick={this._subReplay.bind(this)}>确定</button></p>
			</article>
		)
	}
}
