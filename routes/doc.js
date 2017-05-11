const doc = require('../model/doc.js');
const common = require('../modules/common.js');
module.exports = {
	add:(req,res,next)=>{
		var newDoc = {
			title:req.body.title,
			user:req.body.user,
			contact:req.body.contact,
			address:req.body.address,
			city:req.body.city,
			email:req.body.email,
			unit:req.body.unit,
			file:req.body.file
		};
		newDoc = new doc(newDoc);
		newDoc.save((err,result)=>{
			if(err){
				throw new Error('投稿失败!');
			}else{
				res.locals.status = 1;
				res.locals.message = '投稿成功!'
			}
		}).then(function(){
			next();
		})


	},
	list:(req,res,next)=>{
		doc
			.find()
			.populate('file')
			.exec((err,result)=>{
				if(err){
					throw new Error('查询投稿数据失败!');
				}else{
					res.locals.status = 1;
					result = common.timeFormat(result);
					res.locals.datas = result;
				}
			}).then(()=>{
				next();
			})
	}
}
