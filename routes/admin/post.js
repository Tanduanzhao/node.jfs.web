const Post = require('../../model/post.js');
const Type = require('../../model/type.js');
const Classify = require('../../model/classify.js');
const moment = require('moment');
module.exports = {
	list:function(req, res, next) {
		console.log(1);
        let page = new Number(req.query.page) || 1,obj={},newArr=[],searchTotal=0,total=0,searchId;
        const pageSize = 20;
				let search = Post;
				if(req.query.cid){
					if(req.query.cid == 0){
						search = Post.where({typeId:{$eq:null}})
					}else{
						search = Post.where({typeId:req.query.cid})
					}
				}
        const totalPost = function() {
            return search.count().exec(function(err, result) {
                return new Promise(function(resolve, reject) {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err);
                    }
                })
            })
        };
        const totalSearch = function(obj) {
            return  search.find().where(obj).count().exec()
        };
        function getIdByType(obj){
            return Type.find().where(obj).exec().then(
              (result)=>{
                  return new Promise(function (resolve, reject) {
                      result.forEach((item)=> {
                          if (!!item._id) {
                              newArr.push(item._id);
                          }
                      });
                      resolve(newArr)
                  })
              }
            )
        }
        if( typeof req.query.searchValue == 'undefined' || req.query.searchValue == ''){
            searchId=null;
        }else{
            searchId= {name: {$regex:req.query.searchValue}}
        }
       getIdByType(searchId).then((result)=>{
		   console.log(2);
            if( typeof req.query.searchValue == 'undefined' || req.query.searchValue == ''){
                obj = null;
            }else{
                obj = {$or:[{title:{$regex:req.query.searchValue}},{typeId:{$in:result}}]}
            }
            return totalSearch(obj);
        }).then((count)=>{
			console.log(3);
             searchTotal = count;
           return totalPost()
       }).then((count)=>{
		   console.log('result');
            search.find().where(obj).limit(pageSize).skip((page - 1) * pageSize).populate('typeId', "_id name").sort({_id:-1}).exec(function(err, result) {
                if (err) {
                    console.log(err);
                    res.locals.message = '查询文章失败!';
                } else {
                    if( typeof req.query.searchValue == 'undefined' || req.query.searchValue == ''){
                        total = count;
                    }else{
                        total = searchTotal;
                    }
                    res.locals.status = 1;
                    res.locals.datas = result;
                    res.locals.message = '查询文章成功';
                    res.locals.count = total;
                    res.locals.totalPage = (total / pageSize) > 1 ? Math.ceil(total / pageSize) : 1;
                    res.locals.page = page;
                }
                next();
            })
        })
    },
    single:function(req, res, next) {
        const post = Post.findOne().where({
            _id: req.params.id
        }).populate('typeId files', "_id name path").exec(function(err, result) {
            if (err) {
                res.locals.message = '查询文章失败!';
            } else {
                res.locals.status = 1;
				result = result.toObject();
				result.outDate = moment(result.outDate).format('YYYY-MM-DD');
                res.locals.datas = result;
                res.locals.message = '查询文章成功';
            }
        })
        const classify = Classify.find().exec(function(err,result){
            if(err){
                console.log('查询分类出错!');
            }else{

                res.locals.classify = result;
            }
        })
        Promise.all([post,classify]).then(function(){
            next()
        })
    },
    add:function(req, res, next) {
        let newPost = {
            title: req.body.title,
            content: req.body.content,
            imgUrl: req.body.imgUrl,
            publishDate: +new Date(),
            type:req.body.type,
            publishUser: req.session.username,
            typeId: req.body.typeId == 0 ? null : req.body.typeId,
            keywords:req.body.keywords,
            discription:req.body.discription
        }
        if(req.body.fileId){
            newPost.files = [req.body.fileId]
        }
		if(req.body.outDate){
			newPost.outDate = new Date(req.body.outDate)
		}
        const post = new Post(newPost);
        post.save(function(err, result) {
            if (err) {
                res.locals.message = '新增文章失败!';
            } else {
                console.log(result, '新增文章成功!');
                res.locals.status = 1;
                res.locals.message = '新增文章成功!';
            }
            next();
        })
    },
    update:function(req, res, next) {
        let newPost = {
            title: req.body.title,
            content: req.body.content,
            imgUrl: req.body.imgUrl,
            files:req.body.fileId,
            type:req.body.type,
            publishUser: req.session.username,
            typeId: req.body.typeId == 0 ? null : req.body.typeId,
            keywords:req.body.keywords,
            discription:req.body.discription
        }
        if(req.body.fileId){
            newPost.files = [req.body.fileId]
        }
		if(req.body.outDate){
			newPost.outDate = new Date(req.body.outDate)
		}
		console.log(newPost);
        Post.update({
            _id: req.params.id
        }, {
            $set: newPost
        }, function(err, result) {
            if (err) {
                res.locals.message = '更新文档' + req.params.id + '失败!';
            } else {
                res.locals.message = '更新文档成功!'
                res.locals.status = 1;
            }
            next();
        })
    },
    delete:function(req, res, next) {
        Post.remove({
            _id: req.params.id
        }, function(err, result) {
            // console.log(result);
            if (!err) {
                res.locals.message = '删除文档成功!';
                res.locals.status = 1;
            } else {
                res.locals.message = '删除文档失败!';
            }
            next();
        })
    }
}
