var post = require('../model/post.js');
var hisAddress = require('../config.inc.js');
var iconv = require("iconv-lite");
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
		request({
			url:'http://192.168.1.234/Default.asmx/getDoctorInfo?Request=<req><hospitalId>31</hospitalId><deptId></deptId><doctorId></doctorId></req>'
			,headers:{'Accept-Charset':'utf-8'}
		},(err,respones,body)=>{
			parseString(body,{explicitArray : false},function(err,result){
				res.locals.status = 1;
				res.locals.datas = result;
				next();
			})
		})
	},
	getDeptInfo:(req,res,next)=>{
		var regInfoUrl="http://192.168.1.234/Default.asmx/getDeptInfo";
		regInfoUrl="http://192.168.1.234/Default.asmx/getDeptInfo?Request=<req><hospitalId>31</hospitalId><deptId></deptId><deptType></deptType></req>";
		request(regInfoUrl,(err,respones,body)=>{
			parseString(body,{explicitArray : false},function(err,result){
				res.locals.datas={};
				res.locals.datas=result;
				next();
			})
		})
	},
	getRegInfo:(req,res,next)=>{
		var deptInfoTodayUrl='http://192.168.1.234/Default.asmx/getRegInfo?Request=<req><hospitalId>31</hospitalId><deptId>'+req.query.id+'</deptId><doctorId /><startDate>'+req.query.time+'</startDate><endDate>'+req.query.time+'</endDate></req>';
		request(deptInfoTodayUrl,(err,respones,body)=>{
			parseString(body,{explicitArray : false},function(err,result){
				res.locals.status = 1;
				res.locals.datas=result;
				next();
			})
		})
	}
}