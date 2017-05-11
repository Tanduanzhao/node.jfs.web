var upload = require('../modules/upload.js');
var File = require('../model/file.js');
module.exports = function(req,res,next){
	upload(req).then(function(result){
		console.log(result)
		var fileInfo = new File({
			path:result.upload.path.substr(result.upload.path.match(/\/|\\/).index),
			name:result.upload.name
		})
    	fileInfo.save(function(err,fileInfo){
    		res.locals.status = 1;
			res.locals.message = "上传图片成功";
			res.locals.datas = {
				path:fileInfo.path,
				name:fileInfo.name,
				id:fileInfo._id
			};
			next();
    	})
		
	})
}