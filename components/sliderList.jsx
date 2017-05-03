import React,{Component} from 'react';
import {Ajax} from './functions/ajax.js';
export default class Slider extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	file:'',
	  	imgList:[]
	  };
	}
	_loadData(){
		Ajax({
			url:'/admin/slider',
			methed:'GET'
		}).then((res)=>{
			console.log(res)
		})
	}
	_fileChange(){
		let item = this.refs.file.files[0];
		let newFile = new FormData();
		newFile.append('upload',item);
		Ajax({
			url:'/uploads',
			type:'file',
			body:newFile
		}).then((res)=>{
			Ajax({
				url:'/admin/slider',
				method:'POST',
				datas:{
					title:res.datas.name,
					path:res.datas.path
				}
			}).then((result)=>{
				if(result.status == 1){
					let arr = this.state.imgList;
					arr.push(res.datas);
					this.setState({
						imgList:arr
					});
				}
			})
		})
	}
	componentDidMount() {
		this._loadData()
	}
	render(){
		return(
			<div>
				<ul className="uk-thumbnav">
				    {
				    	this.state.imgList.map((item)=>{
				    		return <li key={Math.random()} className="uk-active"><a href="" className="uk-thumbnail uk-thumbnail-small"><img src={item.path} alt=""/></a></li>
				    	})
				    }
				</ul>
				<form id="fileForm" encType="multipart/form-data" className="uk-form uk-form-stacked">
					<div className="uk-form-row">
						<div className="uk-form-file">
						    <button className="uk-button">上传文件</button>
						    <input type="file" id="WU_FILE_0" accept="image/*" onChange={this._fileChange.bind(this)} ref="file"/>
						</div>
					</div>
				</form>
			</div>
		)
	}
}