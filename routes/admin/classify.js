const Classify = require('../../model/classify.js')
module.exports = function(req,res,next){
    Classify.find().exec(function(err,result){
        if(err){
            console.log('查询分类出错!');
        }else{
        	res.locals.status = 1;
            res.locals.classify = result;
        }
        next();
    })
}