var category = require('./category.js');
var typeId = '58ddc42c4a354c08cee7cf86';






module.exports = function(req,res){

	category(req,res,typeId,'news')
}