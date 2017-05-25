/*
	status	文稿状态	0未处理 1处理中 2 处理完毕 
*/
const mongoose = require('../config.db.js');
const Schema = mongoose.Schema({
	user:String,
	email:String,
	contact:String,
	address:String,
	title:String,
	content:String,
	cardID:String,
	publishDate:{
		type:Date,
		default:new Date()
	},
	checked:{
		type:Boolean,
		default:false
	},
	replay:String,
	replayTime:Date,
	status:{
		type:Number,
		default:0
	}
})
module.exports = mongoose.model('feedback',Schema);
