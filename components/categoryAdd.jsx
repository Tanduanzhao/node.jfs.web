import React,{Component} from 'react';
import {Ajax} from './functions/ajax.js';
export default class CategoryAdd extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	ue:null,
	  	imgUrl:null,
	  	categorys:[],
	  	parent:0,
	  	name:'',
	  	ueditorId:'edit',
	  	link:'',
	  	page:'',
	  	classify:[]
	  };
	  this.getAllCategory = this.getAllCategory.bind(this);
	}

	getAllCategory(){
		Ajax({
			url:'/admin/category',
			method:'GET'
		}).then((res)=>{
			if(res.status == 0){
				alert(res.message);
			}else{
				this.setState({
					categorys:res.datas
				});
			}
		})
	}

	getSingleCategory(){
		Ajax({
			url:`admin/category/${this.props.params.id}`,
			method:'GET'
		}).then((res)=>{
			if(!!res.status){
				this.setState({
					name:res.datas.name,
					discription:res.datas.discription,
					parent:res.datas.parentId,
					imgUrl:res.datas.imgUrl,
					type:res.datas.type,
					page:res.datas.page,
					link:res.datas.link || this.state.link,
					classify:res.classify
				});
				if(res.datas.type == 'article'){
					this.state.ue.ready(()=>{
						if(!!res.datas.article){
							this.state.ue.setContent(res.datas.article);
						}
						
						this.state.ue.show();
					})
					

				}
			}else{
				alert(res.message);
			}
		})
	}
	getClassify(){
		Ajax({
			url:'classify',
			method:'GET'
		}).then((res)=>{
			if(!!res.status){
				this.setState({
					classify:res.classify
				})
			}
		})
	}

	backAction(){
		this.props.router.goBack();
	}
	addAction(){
		const post = Ajax({
			url:'/admin/category',
			method:'PUT',
			datas:{
				title:this.state.name,
				discription:this.state.discription,
				article:this.state.ue.getContent(),
				parentId:this.state.parent,
				imgUrl:this.state.imgUrl,
				page:this.state.page,
				link:this.state.link,
				type:this.refs.type.value
			}
		}).then((res)=>{
			if(res.status === 0){
			}else{
				this.backAction();
			}
		})
	}
	updateAction(){
		Ajax({
			url:`admin/category/${this.props.params.id}`,
			method:'post',
			datas:{
				title:this.state.name,
				discription:this.state.discription,
				parentId:this.state.parent,
				page:this.state.page,
				link:this.state.link,
				article:this.state.ue.getContent(),
				imgUrl:this.state.imgUrl,
				type:this.refs.type.value
			}
		}).then((res)=>{
			if(!!res.status){
				this.backAction();
			}
		})
	}
	componentWillMount() {
		this.getAllCategory();
	}
	componentDidMount() {
		if(!!this.props.params.id){
			this.getSingleCategory();
		}else{
			this.getClassify();
		};
		//实例化编辑器
		this.state.ue = UE.getEditor(this.state.ueditorId);

		this.state.ue.ready(()=>{
			this.state.ue.hide();
			if(this.state.type == 'article'){
				this.state.ue.show();
			}
		})
	}
	_parentChange(){
		this.setState({
			parent:this.refs.parent.value
		})
	}
	componentWillUnmount() {
		this.state.ue.destroy();
		this.setState({
			ue:null
		})
	}
	_titleChange(){
		this.setState({
			name:this.refs.name.value
		})
	}
	_discriptionChange(){
		this.setState({
			discription:this.refs.discription.value
		})
	}
	_uploadThumbnail(){
		let item = this.refs.imgUrl.files[0];
		let newFile = new FormData();
		newFile.append('upload',item);
		Ajax({
			url:'/uploads',
			type:'file',
			body:newFile
		}).then((res)=>{
			this.setState({
				imgUrl:res.datas.path
			})
		})
	}
	_typeChange(){
		this.setState({type:this.refs.type.value});
		if(this.refs.type.value == 'article'){
			this.state.ue.show();
		}else{
			this.state.ue.hide();
		}
	}
	_pageChange(){
		this.setState({
			page:this.refs.page.value
		})
	}
	_linkChange(){
		this.setState({
			link:this.refs.link.value
		})
	}

	render(){
		return(
			<div>
				<form className="uk-form uk-form-stacked">
					<div className="uk-form-row">
						<label className="uk-form-label">分类名称</label>
						<input ref="name" value={this.state.name} onChange={this._titleChange.bind(this)} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">分类描述</label>
						<textArea ref="discription" rows={5} value={this.state.discription} onChange={this._discriptionChange.bind(this)} className="uk-form-width-large"></textArea>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">分类缩略图</label>
						<div className="uk-form-file">
						    <button className="uk-button uk-button-link"><i className="uk-icon-photo"></i> 上传图片</button>
						    <input type="file" id="WU_FILE_0" accept="image/*" onChange={this._uploadThumbnail.bind(this)} ref="imgUrl"/>
						    {
						    	this.state.imgUrl && <img className="uk-thumbnail uk-margin-left" src={this.state.imgUrl} width="200"/>
						    }
						</div>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">所属分类</label>
						<select ref="parent" value={this.state.parent} onChange={this._parentChange.bind(this)}>
							<option value="0">首页</option>
							{
								this.state.categorys.map((ele)=>{
									return <option key={ele._id} value={ele._id}>{ele.name}</option>
								})
							}
						</select>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">类型</label>
						<select ref="type" value={this.state.type || 'list'} onChange={this._typeChange.bind(this)}>
							{
								this.state.classify.map((ele)=>{
									return <option key={ele._id} value={ele.value}>{ele.name}</option>
								})
							}
						</select>
						<span className={`uk-margin-left${this.state.type === 'page' ? '' : ' uk-hidden'}`}>
							<input ref="page" type="text" placeholder="请输入页面文件名" value={this.state.page} onChange={this._pageChange.bind(this)}/>
						</span>
						<span className={`uk-margin-left${this.state.type === 'link' ? '' : ' uk-hidden'}`}>
							<input ref="link" type="text" placeholder="请输入需要链接的地址" value={this.state.link} onChange={this._linkChange.bind(this)}/>
						</span>
						{
							<script id={this.state.ueditorId} style={{width:'100%',height:'400px'}}></script>
						}
						
					</div>
					<div className="uk-form-row">
						{
							this.props.params.id ? <button className="uk-button uk-button-primary" onClick={this.updateAction.bind(this)} href="javascript:void(0);">更新</button> : <button className="uk-button uk-button-primary" onClick={this.addAction.bind(this)} href="javascript:void(0);">提交</button>
						}
						<button className="uk-button uk-margin-left" onClick={this.backAction.bind(this)}>返回</button>
					</div>
				</form>
			</div>
		)
	}
}