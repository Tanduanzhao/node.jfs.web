var post = require('../model/post.js');
const common = require('../modules/common.js');

function getPost(id){
	return new Promise(function(resolve,reject){
		post.findById(id).exec(function(err,result){
			if(!err){
				resolve(result)
			}
		});
	})
}


module.exports = function(req,res){
	getPost(req.params.id).then(function(result){
		res.locals.post = common.singleTimeFormat(result);
	}).then(function(){
		common.nav().then(function(nav){
			res.locals.nav = nav;
			res.render('post');
		})
	})
}