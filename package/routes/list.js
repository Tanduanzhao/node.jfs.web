module.exports = function(req,res){

	var pageSize = 10;
	var page = 1;

	if(req.query.page && req.query.page>0){
		page = req.query.page;
	}

	var type = common.getType(typeId);
	var typeList = common.getTypeList(typeId);
	var active = common.getType(typeId);
	var postList;

	typeList.then(function(result){
		res.locals.typeList = result;
		if(!!req.params.type){
			postList = common.getPostList(req.params.type,pageSize,page);
			active = common.getType(req.params.type)
		}else{
			var ids = [];
			result.map(function(item){
				ids.push(item._id)
			});
			postList = common.getAllPostList(ids,pageSize,page);
		}
		Promise.all([type,postList,active]).then(function(result){
			// res.send(e);
			res.locals.type = result[0];
			res.locals.postList = common.timeFormat(result[1][0]);
			res.locals.active = result[2];
			res.locals.page = {
				page:page,
				total:result[1][1],
				size:pageSize
			};
			res.render('news');
		})
	})
}