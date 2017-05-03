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
				replay:this.state.data.replay
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
				<p><button className="uk-button uk-button-primary" onClick={this._subReplay.bind(this)}>回复</button></p>
			</article>
		)
	}
}
