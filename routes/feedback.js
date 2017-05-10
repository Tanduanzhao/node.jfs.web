const feedback = require('../model/feedback.js');
const common = require('../modules/common.js');
const moment = require('moment');
let page = 1;
let pageSize = 10;
module.exports = {
	add:(req,res,next)=>{
		console.log('enter');
		let _obj = {};
		if(req.body.title){
			_obj.title = req.body.title
		}
		if(req.body.user){
			_obj.user = req.body.user
		}
		if(req.body.contact){
			_obj.contact = req.body.contact
		}
		if(req.body.email){
			_obj.email = req.body.email
		}
		if(req.body.address){
			_obj.address = req.body.address
		}
		if(req.body.content){
			_obj.content = req.body.content
		}
		let newFB = new feedback(_obj);
		newFB.save((err,result)=>{
			console.log(err);
			if(err){
				throw new Error('添加民意征集出错！');
			}else{
				res.locals.status = 1;
				res.locals.message = "已经收到您的建议，感谢！"
			}
			next();
		})
	},
	list:(req,res,next)=>{
		page = req.query.page || page;
		feedback
			.find()
			.limit(pageSize)
			.skip((page-1)*pageSize)
			.exec((err,result)=>{
				if(err){
					throw new Error('查询投诉建议错误!');
				}else{
					res.locals.status = 1;
					res.locals.datas = common.timeFormat(result);
					res.locals.page = {
						page:page,
						pageSize:pageSize
					}
				}
			})
			.then(()=>{
				feedback
					.count()
					.exec((err,count)=>{
						if(err){
							throw new Error('统计投诉建议错误!');
						}else{
							res.locals.page.total = count;
						}
					})
					.then(()=>{
						next()
					})
			})
	},
	single:(req,res,next)=>{
		feedback
			.findById(req.params.id)
			.exec((err,result)=>{
				if(err){
					throw new Error('查询'+req.query.id+'失败!');
				}else{
					res.locals.status = 1;
					result = result.toObject();
					result.publishDate = moment(result.publishDate).format('YYYY-MM-DD');
					if(result.replay){
						result.replayDate = moment(result.replayDate).format('YYYY-MM-DD');
					}

					res.locals.datas = result;
				}
				next()
			})
	},
	rePlay:(req,res,next)=>{
		console.log(req.body.replay);
		feedback
		.update({_id:req.params.id},{$set:{replay:req.body.replay,status:req.body.status,replayDate:new Date()}},(err,result)=>{

			if(err){
				throw new Error('修改id为'+req.params.id+'的状态错误!');
			}else{
				console.log(result);
				res.locals.status =1;
				res.locals.message = "修改成功!"
			}
			next();
		})
	}
}
