var moment = require('moment');
var post = require('../model/post.js');
var type = require('../model/type.js');


function selectTypeId(id){
	//根据parentId的值来查询所属分类id
	// console.log(id);
	// console.log('------------------');
	return new Promise(function(resolve,reject){
		type
			.find()
			.where({parentId:id})
			.select('_id name')
			.exec(function(err,result){
				if(!err){
					resolve(result)
				}
			})
	})
}

function sortArray(arr){
	let _d = [];
	arr.forEach((k)=>{
		if(!k.parentId){
			_d.push(k);
		}
	})
	function loopArr(item){
		let _ii = [];
		item.forEach(function(k){
			k.children = [];
			arr.forEach(function(e){
				if(k._id.toString() == e.parentId){
					k.children.push(e)
				}
			})
			if(k.children.length!=0){
				loopArr(k.children)
			}
			_ii.push(k);
		})
		return _ii;
	}
	return loopArr(_d);
}

module.exports = {
	singleTimeFormat:function(obj){
		if(!obj._doc){
			obj.publishDate = moment(obj.publishDate).format('YYYY-MM-DD');
		}else{
			
			obj._doc.publishDate = moment(obj.publishDate).format('YYYY-MM-DD');
		}
		return obj;
	},
	timeFormat:function(arr){
		var _a = [];
		arr.forEach((item,index)=>{
			item = this.singleTimeFormat(item);
			_a.push(item);
		});
		return _a;
	},
	getPost:function(typeName,limit=4){
		return new Promise(function(resolve,reject){
			type.findOne({name:typeName},['_id']).exec(function(err,result){
				post.find({typeId:result._id},['_id','title','publishDate','imgUrl','type']).sort({publishDate:-1}).limit(limit).exec(function(err,result){
					if(!err){
						resolve(result,'查询的文章')
					}
				})
			})
		})
	},
	getImagePosts:function(){
		return new Promise((resolve,reject)=>{
			type
				.find()
				.where({name:{$in:['各地动态','结控动态']}})
				.select('_id')
				.exec(function(err,result){
					if(err){
						throw new Error('查询图片新闻出错',err);
					}else{
						let typeIds = result.map(function(item){
							return item._id;
						});
						console.log(typeIds);
						post
							.find()
							.where({typeId:{$in:typeIds},imgUrl:{$ne:null}})
							.select('_id publishDate title imgUrl')
							.limit(4)
							.sort({publishDate:-1})
							.exec(function(_err,_result){
								if(err){
									throw new Error('查询图片新闻文章出错');
								}else{
									console.log(_result);
									resolve(_result);
								}
							})
					}
				})
		})
	},
	singlePost:function(id){
		return new Promise(function(resolve,reject){
			post
			.findById(id)
			.select('username title publishDate content type')
			.exec(function(err,result){
				if(!err){
					resolve(result)
				}
			});
		})
	},
	getType:function(id,shouldChildren){
		return new Promise(function(resolve,reject){
			type.findById(id).exec(function(err,res){
				if(!err){
					resolve(res);
				}
			})
		})
	},
	getChildrenType(id){
		return new Promise(function(resolve,reject){
			type.find().where({parentId:id}).exec(function(err,res){
				if(!err){
					resolve(res);
				}
			})
		})
	},
	getTypeList:function(id,childrenType){
		return new Promise(function(resolve,reject){
			type.find().where({parentId:id}).exec(function(err,res){
				if(!err){

					//二级菜单流程
					let childrenPro = [];
					res.forEach(function(item){
						childrenPro.push(new Promise(function(resolve,reject){
							type.find().where({parentId:item._id}).exec(function(err,result){
								item = item.toObject();
								(function(_r){
									// if(!_e){
										item.children = _r;
										resolve(item)
									// }
								})(result)
							})
						}))
					});
					Promise.all(childrenPro).then(function(result){
						resolve(result)
					})
				}else{
					reject(err)
				}

			})
		})
	},
	getPostList:function(id,size=10,page=1){
		return new Promise(function(resolve,reject){
			post
				.count()
				.where({typeId:id})
				.exec(function(err,total){
					post
						.find()
						.where({typeId:id})
						.select('_id title publishDate')
						.sort({publishDate:-1})
						.limit(size)
						.skip((page-1)*size)
						.exec(function(err,res){
							if(!err){
								resolve([res,total])
							}
						})
				})
		})
	},
	getAllPostList:function(ids,size=10,page=1){
		return new Promise(function(resolve,reject){
			post
				.count()
				.where({typeId:{"$in":ids}})
				.exec(function(err,total){
					post
						.find()
						.where({typeId:{"$in":ids}})
						.select('_id title publishDate type files imgUrl discription')
						.sort({publishDate:-1})
						.populate('files')
						.limit(size)
						.skip((page-1)*size)
						.exec(function(err,res){
							if(!err){
								resolve([res,total])
							}
						})
				})



		})
	},
	getPostListN:function(id){
		var _idArr = [id],_pArr=[];

		function loopPromise(_id,callback){
				selectTypeId(_id).then(function(result){
					if(result.length!=0){
						Promise.all(result.map(function(item){
							// (function(_d){
							// console.log
								_idArr.push(item._id)
								loopPromise(item._id,callback)
							// })(item._id)
						}))
					}else{
						callback();
					}
					
				})
		}
		return new Promise(function(_r,_s){
			loopPromise(id,function(res){
				var t = null;
				if(!!t){
					clearTimeout(t);
				}
				t = setTimeout(()=>_r(_idArr),10);	
			})
		})
		

	},
	nav:function(){
		

		return new Promise((res,rej)=>{
			type.find()
				.select('_id name parentId type link page')
				.exec(function(err,result){
					if(err){
						return console.log(err);
					}
					let nav = [];
					nav = result.map((item)=>{
						return item.toObject();
					});

					// res.locals.nav = sortArray(nav);
					res(sortArray(nav))
				})
		})
	}

}
