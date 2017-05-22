const mongoose = require('../config.db.js');
const Post = new mongoose.Schema({
	title:String,//文章标题
	content:String,//文章内容
	publishUser:String,//发布用户
	publishDate:Date,//发布日期
	typeName:String,//分类名称
	imgUrl:String,//文章缩略图
	type:{//文章类型
		type:String,
		default:'article'
	},
	files:[{//文章附件
		type:mongoose.Schema.Types.ObjectId,
		ref:'file'
	}],
	discription:String,
	typeId:{type:mongoose.Schema.Types.ObjectId,ref:"type"},//文章所属分类Id，关联type表
	keywords:String,//文章关键字
	form:String
})

module.exports = mongoose.model('archives',Post);
