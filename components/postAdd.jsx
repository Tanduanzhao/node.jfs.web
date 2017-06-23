import React,{Component} from 'react';
import Link from 'react-router';
import {Ajax} from './functions/ajax.js';
export default class PostAdd extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	id:'edit',
	  	imgUrl:null,
	  	ue:null,
	  	categorys:[],
	  	title:'',
	  	typeId:0,
	  	keywords:'',
	  	discription:'',
	  	classify:[],
		showDropdown:false,
		defaultCategoryName:'未分类',
		outDate:''
	  };
	  this._getSinglePost = this._getSinglePost.bind(this);
	  this._titleOnchange = this._titleOnchange.bind(this);
	  this._documentClick = this._documentClick.bind(this);
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
					categorys:res.nav
				});
			}
		})
	}
	backAction(){
		this.props.router.goBack();
	}
	addAction(){
		if(this.refs.type.value === "document" && !this.state.fileId){
			alert('文稿类型必须选择附件');
			return false;
		}
		const post = Ajax({
			url:'/admin/post',
			method:'PUT',
			datas:{
				title:this.state.title,
				content:this.ue.getContent(),
				typeId:this.state.typeId,
				imgUrl:this.state.imgUrl,
				fileId:(this.state.fileId ? [this.state.fileId] : null),
				keywords:this.state.keywords,
				type:this.refs.type.value,
				discription:this.state.discription,
				outDate:this.state.outDate === '' ? null : this.state.outDate
			}
		}).then((res)=>{
			if(res.status === 0){
				alert(res.message);
			}else{
				alert(res.message);
				this.backAction();
			}
		})
	}
	updateAction(){
		Ajax({
			url:`/admin/post/${this.props.params.id}`,
			method:'POST',
			datas:{
				title:this.state.title,
				content:this.ue.getContent(),
				typeId:this.state.typeId,
				imgUrl:this.state.imgUrl,
				fileId:(this.state.fileId ? [this.state.fileId] : null),
				keywords:this.state.keywords,
				type:this.refs.type.value,
				discription:this.state.discription,
				outDate:this.state.outDate === '' ? null : this.state.outDate
			}
		}).then((res)=>{
			if(!!res.status){
				alert(res.message);
				this.backAction();
			}else{
				alert(res.message);
			}
		})
	}
	_titleOnchange(event){
		this.setState({
			title:event.target.value
		})
	}
	_typeIdOnchange(id){
		this.setState({
			typeId:id
		})
	}
	_typeOnChange(){
		this.setState({
			type:this.refs.type.value
		},this._checkUeditorStatus);
	}

	_checkUeditorStatus(){
		if(this.state.type == 'article'){
			this.ue.setShow();
		}else{
			this.ue.setHide();
		}
	}

	_setContent(content){
		return ()=>{
			this.ue.setContent(content)
		}
	}
	_keywordsOnchange(){
		this.setState({
			keywords:this.refs.keywords.value
		})
	}
	_outDateOnchange(){
		console.log(this.refs.outDate.value);
	}
	//请求问固定ID文章
	_getSinglePost(){
		Ajax({
			url:`/admin/post/${this.props.params.id}`,
			method:'GET'
		}).then((res)=>{
			if(!!res.status){
				this.setState({
					title:res.datas.title,
					imgUrl:res.datas.imgUrl,
					keywords:res.datas.keywords,
					type:res.datas.type,
					classify:res.classify
				});
				if(res.datas.files){
					this.setState({
						file:res.datas.files[0]
					})
				}
				if(!!res.datas.typeId){
					this.setState({
						typeId:res.datas.typeId._id,
						defaultCategoryName:res.datas.typeId.name
					})
				}
				if(!!res.datas.discription){
					this.setState({
						discription:res.datas.discription
					})
				}
				if(!!res.datas.outDate){
					this.setState({
						outDate:res.datas.outDate
					})
				}
				this.ue.ready(this._setContent(res.datas.content))
			}else{
				alert(res.message);
			}
		})
	}
	_getClassify(){
		Ajax({
			url:'/classify',
			method:'GET'
		}).then((res)=>{
			if(!!res.status){
				this.setState({
					classify:res.classify
				})
			}
		})
	}

	componentDidMount() {
		this.ue = UE.getEditor(this.state.id)
		this.getAllCategory();
		if(this.props.params.id){
			this._getSinglePost();
		}else{
			this._getClassify();
		};

		this.datepicker = UIkit.datepicker(this.refs.outDate,{
			format:'YYYY-MM-DD'
		});

		this.datepicker.on('hide.uk.datepicker',()=>{
			this.setState({
				outDate:this.refs.outDate.value
			})
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
	_uploadfile(){
		let item = this.refs.file.files[0];
		let newFile = new FormData();
		newFile.append('upload',item);
		Ajax({
			url:'/uploads',
			type:'file',
			body:newFile
		}).then((res)=>{
			this.setState({
				file:res.datas,
				fileId:[res.datas.id]
			})
		})
	}
	_discriptionOnchange(){
		this.setState({
			discription:this.refs.discription.value
		})
	}
	_showDropdown(){
		if(this.state.showDropdown) return false;
		this.setState({
			showDropdown:true
		});

		document.addEventListener('click',this._documentClick);

	}

	_toggleCategoryName(name){
		this.setState({
			defaultCategoryName:name
		})
	}
	_hideDropdown(){
		this.setState({
			showDropdown:false
		});
		document.removeEventListener('click',this._documentClick)
	}

	_toggleDropdown(){
		this.state.showDropdown ? this._hideDropdown() : this._showDropdown()

	}
	_stopPropagation(event){
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
	}
	_documentClick(){
		this._hideDropdown();
	}

	_toggleType(id,name){
		this._hideDropdown();
		this._toggleCategoryName(name);
		this._typeIdOnchange(id);
	}


	_renderNavs(lists){
		if(lists.length==0) return [];
		let nodeLists = [];
		lists.forEach((item)=>{
			nodeLists.push(
				<li key={item._id} data-id={item._id}>
					{
						!!item.childern ? <div className="uk-nav-header">{item.name}</div> : <div onClick={this._toggleType.bind(this,item._id,item.name)}>{item.name}</div>
					}
					{
						item.children.length !=0 ? <ul>{this._renderNavs(item.children)}</ul> : null
					}
				</li>
			)

		})
		return nodeLists;
	}
	componentWillUnmount() {
		this.ue.destroy();
		this.setState({
			ue:null
		})
	}
	render(){
		let navs = this._renderNavs(this.state.categorys);
		navs.push(<li key={'uncategory'}>
			<div onClick={this._toggleType.bind(this,0,'未分类')}>未分类</div>
		</li>)
		return(
			<div>
				<form className="uk-form uk-form-stacked">
					<div className="uk-form-row">
						<label className="uk-form-label">标题</label>
						<input ref="title" onChange={this._titleOnchange.bind(this)} value={this.state.title} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">关键字<small className="uk-margin-left">(多关键字请用|分开)</small></label>
						<input ref="keywords" onChange={this._keywordsOnchange.bind(this)} value={this.state.keywords} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">有效期</label>
						<input ref="outDate" onChange={this._outDateOnchange.bind(this)} value={this.state.outDate} className="uk-form-input" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">描述</label>
						<input ref="discription" onChange={this._discriptionOnchange.bind(this)} value={this.state.discription} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">缩略图</label>
						<div className="uk-form-file">
						    <button className="uk-button uk-button-link"><i className="uk-icon-photo"></i> 上传图片</button>
						    <input type="file" id="WU_FILE_0" accept="image/*" onChange={this._uploadThumbnail.bind(this)} ref="imgUrl"/>
						</div>
						{
							this.state.imgUrl && <img width="200" src={this.state.imgUrl} className="uk-margin-left uk-thumbnail"/>
						}
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">文章内容</label>
						<script id={this.state.id} style={{width:'100%',height:'400px'}}></script>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">所属分类</label>
						<div className={`uk-dropdown-nav uk-button-dropdown${this.state.showDropdown ? ' uk-open' : ''}`} onClick={this._toggleDropdown.bind(this)}>
							<button type="button" className="uk-button">{this.state.defaultCategoryName} <i className="uk-icon-caret-down"></i></button>
							<div onClick={this._stopPropagation.bind(this)} className="uk-dropdown" style={{width:'250px',height:'400px',overflow:'auto'}}>
								<ul className="uk-nav">
									{navs.map((item)=>item)}
								</ul>
							</div>
						</div>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">类型</label>
						<select ref="type" value={this.state.type || 'article'} onChange={this._typeOnChange.bind(this)}>
							{
								this.state.classify.map((ele)=>{
									return <option key={ele._id} value={ele.value}>{ele.name}</option>
								})
							}
						</select>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">附件</label>
						<div className="uk-form-file">
							<button type="button" className="uk-button uk-button-link"><i className="uk-icon-paperclip"></i> 上传文件</button>
						    <input type="file" accept="*" onChange={this._uploadfile.bind(this)} ref="file"/>
						</div>
						<input value={this.state.file ? this.state.file.path : ''} disabled className="uk-form-input uk-form-width-large uk-form-blank uk-margin-left" type="text"/>
					</div>
					<div className="uk-form-row">
						{
							this.props.params.id ? <a className="uk-button uk-button-primary" onClick={this.updateAction.bind(this)} href="javascript:void(0);">更新</a> : <a className="uk-button uk-button-primary" onClick={this.addAction.bind(this)} href="javascript:void(0);">提交</a>
						}
						<a href="javascript:void(0);" className="uk-button uk-margin-left" onClick={this.backAction.bind(this)}>返回</a>
					</div>
				</form>
			</div>
		)
	}
}
