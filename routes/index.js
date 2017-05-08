var Post = require('../model/post.js');
var Type = require('../model/type.js');
var common = require('../modules/common.js');



module.exports = function(req,res,next){
	var imgNewList = common.getImagePosts();
	var localNewList = common.getPost('各地动态',5);
	var centerList = common.getPost('结控动态',5);
	var noticeList = common.getPost('活动公告',5);
	var zbList = common.getPost('招标采购中心',5);
	var intro = common.getChildrenType('58ddc4404a354c08cee7cf87');

	Promise.all([imgNewList,localNewList,centerList,noticeList,zbList,intro]).then(function(result){
		res.locals.imgNewList = result[0];
		res.locals.localNewList = common.timeFormat(result[1]);
		res.locals.centerList = common.timeFormat(result[2]);
		res.locals.noticeList = common.timeFormat(result[3]);
		res.locals.zbList = common.timeFormat(result[4]);
		result[5] = result[5].map(function(ele){
			ele.publishDate = ele.date;
			return ele;
		})
		res.locals.intro = common.timeFormat(result[5]);
		
	}).then(()=>{
		res.render('index');
	})
}