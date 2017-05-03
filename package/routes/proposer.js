const proposer = require('../model/proposer.js');
const common = require('../modules/common.js');
const moment = require('moment');
module.exports = {
	list:(req,res,next)=>{
		proposer
			.find()
			.populate('file')
			.exec((err,result)=>{
				if(err){
					throw new Error('查询志愿者表出错!');
				}else{
					res.locals.status = 1;
					res.locals.datas = common.timeFormat(result);
				}
			}).then(()=>{
				next();
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