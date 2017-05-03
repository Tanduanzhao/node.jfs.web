var type = require('../model/type.js');
const common = require('../modules/common.js');
module.exports = function(req,res,next){
	common.nav().then(function(nav){
		res.locals.nav = nav;
		res.locals.status = 1;
		next();
	})
	
}