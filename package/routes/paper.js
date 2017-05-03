const paper = require('../model/paper.js');
const common = require('../modules/common.js');
module.exports = {
	add:(req,res,next)=>{
		let newPaper=req.body;
		new paper(newPaper).save((err,result)=>{
			if(err){
				throw new Error('发表新论文出错');
			}else{
				res.locals.status = 1;
				res.locals.message = '发布成功';
			}
			next()
		})
	},
	list:(req,res,next)=>{
		console.log(1);
		paper
			.find()
			.populate('file')
			.select('_id title publishDate user file isChecked')
			.exec((err,result)=>{
				if(err){
					throw new Error('查询论文内容错误');
				}else{
					res.locals.datas = common.timeFormat(result);
					res.locals.status = 1;
				}
				next();
				console.log(result);
			})
	},
	single:(req,res,next)=>{
		paper
			.find()
			.where({_id:req.params.id})
			.exec((err,result)=>{
				if(err){
					throw new Error('查询id为:'+req.params.id+'论文信息错误');
				}else{
					res.locals.status = 1;
					res.locals.datas = common.singleFormat(result)
				}
				next();
			})
	}
}