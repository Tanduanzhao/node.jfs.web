const Post = require('../../model/post.js');
const Classify = require('../../model/classify.js');
module.exports = {
	list:function(req, res, next) {
        let page = new Number(req.query.page) || 1;
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
        }

        totalPost().then(function(count) {
            search.find().limit(pageSize).skip((page - 1) * pageSize).populate('typeId', "_id name").sort({_id:-1}).exec(function(err, result) {
                if (err) {
                    console.log(err);
                    res.locals.message = '查询文章失败!';
                } else {
                    res.locals.status = 1;
                    res.locals.datas = result;
                    res.locals.message = '查询文章成功';
                    res.locals.count = count;
                    res.locals.totalPage = (count / pageSize) > 1 ? Math.ceil(count / pageSize) : 1;
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
