//监督投诉
const feedback = require('../model/feedback.js');
const common = require('../modules/common.js');
let page = 1;
let pageSize = 10;
module.exports = {
	list:(req,res,next)=>{
		page = req.body.page || page;
		feedback
			.find()
			.limit(pageSize)
			.skip(page-1*pageSize)
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
	}
}