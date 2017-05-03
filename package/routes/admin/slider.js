const slider = require('../../model/slider.js');
module.exports = {
	list:(req,res,next)=>{
		slider
			.find()
			.exec((err,result)=>{
				if(err){
					throw new Error('读取幻灯片失败!');
				}else{
					res.locals.status = 1;
					res.locals.datas = result;
				}
			})
	},
	add:(req,res,next)=>{
		let newSlider = req.body;
		newSlider = new slider(newSlider);
		newSlider.save((err,result)=>{
			if(err){
				throw new Error('新增幻灯片发生错误:'+err);
			}else{
				res.locals.status = 1;
				res.locals.message = '新增幻灯片成功!';
			}
		})
	}
}