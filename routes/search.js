const Post = require('../model/post.js');
const request = require('request');
const common = require('../modules/common.js');

function search(keyword){
	return new Promise(function(resolve,reject){
		Post.find().where('title',new RegExp(keyword)).sort({'publishDate':'desc'}).exec(function(err,result){
			if(!err){
				resolve(result)
			}
		})
	})
}


module.exports = function(req,res,next){
	search(req.query._k).then(function(result){

		res.locals.result = common.timeFormat(result);
		common.nav().then((nav)=>{
				res.locals.nav = nav;
				res.render('search');
			})
	})
	
}