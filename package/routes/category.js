var type = require('../model/type.js');
var post = require('../model/post.js');
var common = require('../modules/common.js');
var request = require('request');
module.exports = function(req,res,typeId,tempPath,listType){
	var pageSize = 10;
	var page = 1;

	if(req.query.page && req.query.page>0){
		page = req.query.page;
	}


	var type = common.getType(typeId);//获取顶级分类
	var typeList = common.getTypeList(typeId);//获取typeId分类下面的所有分类
	var active = common.getType(typeId);//获取当前分类
	var childrenNav = new Promise((_r,_s)=>{_r(null)});//获取子分类
	var postList = common.getPostListN(typeId);//获取顶级分类下面的所有文章列表
	var post=new Promise((_r,_s)=>{_r(null)});//获取文章内容
	var article=new Promise((_r,_s)=>{_r(null)});//获取分类为文章的时候显示的内容

	if(!!req.params.type){//如果获取到子分类参数
		postList = common.getPostListN(req.params.type);//文章分类为子分类下面的文章列表
		active = common.getType(req.params.type)//当前分类为子分类

		if(req.query.type){
			res.locals.childrenType = req.query.type;
			if(req.query.type == 'nav'){//如果获取到当前分类类型为导航类型
				childrenNav = common.getTypeList(req.params.type);//子分类为当前分类下面的子分类
			}else if(req.query.type == 'article'){//如果获取当前分类类型为文章类型
				article = common.getType(req.params.type);//获取分类文章内容
			}else if(req.query.type == 'page'){//如果获取当前分类类型为页面型
				res.locals.path = req.query.path;//返回页面路径让ejs动态抓取
			}
		}
	}
	if(!!req.query.pid){
		post = common.singlePost(req.query.pid);//获取文章内容
		res.locals.childrenType = 'post';
	}

	typeList.then(function(result){
		res.locals.typeList = result;
	}).then(function(){
		type
			.then((result)=>{
				res.locals.type = result;
				return	active
							.then((result)=>{
								res.locals.active = result;
							})
			})
			.then(()=>{
				return	childrenNav
							.then((result)=>{
								res.locals.childrenList = result;
								
							})
			})
			.then(()=>{
				return	post
							.then((result)=>{
								if(result){
									res.locals.post = ((typeof(result) == 'undefined') ? null : common.singleTimeFormat(result));
								}
							})
			})
			.then(()=>{
				return article
							.then((result)=>{
								if(result){
									result = result.toObject();
									result.publishDate = result.date;
									result.content = result.article;
									res.locals.post = common.singleTimeFormat(result);
								}
							})
			})
			.then(()=>{
				return postList
			})
			.then((list)=>{
				return common.getAllPostList(list,pageSize,page).then(function(_result){
					res.locals.page = {
						page:page,
						total:_result[1],
						size:pageSize
					};
					res.locals.postList = common.timeFormat(_result[0]);
				})
			})
			.then(()=>{
				common.nav().then(function(nav){
					res.locals.nav = nav;
					res.render(tempPath);
				})
			})
	})
}