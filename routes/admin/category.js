var Type = require('../../model/type.js');
var Post = require('../../model/post.js');
var Classify = require('../../model/classify.js');
var request = require('request');
const pageSize = 20;
module.exports = {
	list:function(req, res, next) {
        Type.find().populate('parentId', "_id name").exec(function(err, result) {
            if (err) {
                res.locals.message = '查询分类列表失败';
            } else {
                res.locals.message = '查询分类列表成功!';
                res.locals.datas = result;
                res.locals.status = 1;
            }


        }).then(()=>{
            return new Promise((resolve,reject)=>{
                request('http://127.0.0.1:3000/nav',(t,r)=>{
                        r = JSON.parse(r.body);
                        res.locals.nav = r.nav;
                        resolve(r)
                })
            })
        }).then(()=>{
            next();
        })
    },
    single:function(req, res, next) {
        const type = Type.findOne().where({
            _id: req.params.id
        }).exec(function(err, result) {
            if (!err) {
                res.locals.datas = result;
                res.locals.status = 1
                res.locals.message = `查询单个分类${req.params.id}成功!`
            } else {
                res.locals.message = `查询单个分类${req.params.id}失败!`;
            }
        })
        const classify = Classify.find().exec(function(err,result){
            if(err){
                console.log('查询分类出错!');
            }else{
                res.locals.classify = result;
            }
        })
        Promise.all([type,classify]).then(function(){
            next()
        })
    },
    add:function(req, res, next) {
        const type = new Type({
            name: req.body.title,
            discription: req.body.discription,
            user: req.session.username,
            page: req.body.page,
            date: +new Date(),
            parentId: req.body.parentId == 0 ? null : req.body.parentId,
            imgUrl: req.body.imgUrl,
            article:req.body.article,
            type:req.body.type,
            link:req.body.link
        });
        type.save(function(err, result) {
            if (err) {
                res.locals.message = '新增分类错误!';
            } else {
                res.locals.status = 1;
                res.locals.message = '新增分类成功!';
            };
            next();
        })
    },
    update:function(req, res, next) {
        Type.update({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.title,
                discription: req.body.discription,
                article:req.body.article,
                page:req.body.page,
                link:req.body.link,
                parentId: req.body.parentId == 0 ? null : req.body.parentId,
                imgUrl: req.body.imgUrl,
                type:req.body.type,
                link:req.body.link
            }
        }, function(err, result) {
            if (!err) {
                res.locals.status = 1;
                res.locals.message = '更新分类成功!';
            } else {
                res.locals.message = '更新分类失败!';
            }
            next();
        })
    },
    delete:function(req, res, next) {
        const delType = function() {
            return Type.remove().where({
                _id: req.params.id
            }).exec(function(err, result) {
                return new Promise(function(resolve, reject) {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err)
                    }
                })
            })
        };
        delType().then(function() {
            Post.update({
                typeId: req.params.id
            }, {
                $set: {
                    typeId: null
                }
            }, function(err, result) {
                if (!err) {
                    res.locals.status = 1;
                    res.locals.message = '删除分类成功,并且更新本分类下面的文章为未分类';
                } else {
                    console.log('error');
                    res.locals.message = '删除分类失败!';
                }
                next();
            })
        })
    },
		postList:function(req,res,next){
				const page = req.query.page || 1;
				Post
					.count()
					.where({typeId:req.params.id})
					.exec((err,count)=>{
						return new Promise((resolve,reject)=>{
							if(err){
								throw new Error('统计文章错误');
							}else{
								res.locals.totalPage = count;
								resolve(count)
							}
						})
					})
					.then(()=>{
						Post
							.find()
							.where({typeId:req.params.id})
							.skip((page -1) * pageSize)
							.limit(pageSize)
							.populate("typeId")
							.select('_id title publishDate publishUser typeId')
							.exec((err,result)=>{
									if(err){
											throw new Error("获取"+req.params.id+"分类下的文章失败");
									}else{
										res.locals.datas = result;
										res.locals.page = Number(page);
										res.locals.status = 1;
									}
									next();
							})
					})

		}
}
