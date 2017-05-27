const doc = require('../model/doc.js');
const common = require('../modules/common.js');
let page = 1;
let pageSize = 10;
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
		page =  new Number(req.query.page) || page;
		doc
			.find()
			.populate('file')
			.limit(pageSize)
			.skip((page-1)*pageSize)
			.sort({publishDate:-1})
			.exec((err,result)=>{
				if(err){
					throw new Error('查询投稿数据失败!');
				}else{
					res.locals.status = 1;
					result = common.timeFormat(result);
					res.locals.datas = result;
					res.locals.page = {
						page:page,
						pageSize:pageSize
					}
				}
			})
			.then(()=>{
				doc
				.count()
				.exec((err,count)=>{
					if(err){
						throw new Error('统计投稿数据失败!');
					}else{
						res.locals.page.total = count;
						res.locals.page.totalPage = (count / pageSize) > 1 ? Math.ceil(count / pageSize) : 1;
					}
				})
				.then(()=>{
					next()
				})
			})
	}
}
