var mongoose = require('../config.db.js');
var schema = new mongoose.Schema({
	name:String,
	value:String
});
var defaultClassify = [
{
	name:'列表',
	value:'list'
},{
	name:'文章',
	value:'article'
},{
	name:'分类',
	value:'category'
},{
	name:'下载',
	value:'download'
},{
	name:'文档',
	value:'document'
},{
	name:'页面',
	value:'page'
},{
	name:'链接',
	value:'link'
}]
var model = mongoose.model('classify',schema);
model.find().exec(function(err,result){
	if(err){
		console.log(err);
		throw new Error('查询文档分类collection失败!');
	}else if(!result.length){
		model.create(defaultClassify,function(err,result){
			if(err){
				console.log(err)
			}else{
				console.log('创建默认分类成功')
			}
		});
	}
})
module.exports = model;
