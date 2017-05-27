const proposer = require('../model/proposer.js');
const common = require('../modules/common.js');
const moment = require('moment');
let page = 1, pageSize = 10;
module.exports = {
	list:(req,res,next)=>{
		page =  new Number(req.query.page) || page;
		proposer
			.find()
			.populate('file')
			.limit(pageSize)
			.skip((page-1)*pageSize)
			.sort({publishDate:-1})
			.exec((err,result)=>{
				if(err){
					throw new Error('查询志愿者表出错!');
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
				proposer
				.count()
				.exec((err,count)=>{
					if(err){
						throw new Error('统计投志愿者数据失败!');
					}else{
						res.locals.page.total = count;
						res.locals.page.totalPage = (count / pageSize) > 1 ? Math.ceil(count / pageSize) : 1;
					}
				})
				.then(()=>{
					next()
				})
			})
	},
	add:(req,res,next)=>{
		const _objer = {
			file:req.body.file,
			title:'志愿者申请_'+ moment(new Date()).format('YYYY-MM-DD'),
			publishDate:new Date()
		};
		var dber = new proposer(_objer);
		dber.save((err,result)=>{
			console.log(result);
			if(err){
				throw new Error('添加志愿者申请失败');
			}else{
				res.locals.status = 1;
				res.locals.message = '您的申请已提交，请等待工作人员与您联系!'
			}
			next();
		})
	}
}