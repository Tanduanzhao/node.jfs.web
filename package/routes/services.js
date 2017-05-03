var post = require('../model/post.js');
/*
	58ef19ec40027a02befb903b
 */ 
const request = require('request');
const parseString = require('xml2js').parseString;
module.exports = {
	list:(req,res,next)=>{
		post
			.find()
			.where({typeId:'58ef19ec40027a02befb903b'})
			.select('_id title')
			.exec((err,result)=>{
				if(err){
					throw new Error('查询志愿服务失败');
				}else{
					res.locals.datas = result;
					res.locals.status = 1;
				}
			}).then(()=>{
				next();
			})
	},
	doctors:(req,res,next)=>{
		request('http://localhost:3000/xmls/test.xml',(err,respones,body)=>{
			parseString(body,{explicitArray : false},function(err,result){
				res.locals.status = 1;
				res.locals.datas = result;
				next();
			})
		})
	}
}