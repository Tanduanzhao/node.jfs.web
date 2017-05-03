/*
	诊疗服务 id->58ddc4514a354c08cee7cf88
 */
var category = require('./category.js');
var typeId = '58ddc4514a354c08cee7cf88';
module.exports = (req,res,next)=>{
	category(req,res,typeId,'service')
}