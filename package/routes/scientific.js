const post = require('../model/post.js');
const type = require('../model/type.js');
const common = require('../modules/common.js');
module.exports = {
	team:(req,res,next)=>{
		type
			.findById('58fefdf1f73e4e071e6dd26f')
			.select('article')
			.exec((err,result)=>{
				if(err){
					throw new Error('获取科研队伍分类内容失败');
				}else{
					res.locals.datas = result;
					res.locals.status = 1;

				}
				next()
			})
	},
	item:(req,res,next)=>{
		post
			.find()
			.where({typeId:'58fefe0cf73e4e071e6dd270'})
			.exec((err,result)=>{
				if(err){
					throw new Error('获取科研项目分类内容失败');
				}else{
					res.locals.datas = common.timeFormat(result);
					res.locals.status = 1;
				}
				next();
			})
	}
}