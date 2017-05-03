const mongoose = require('../config.db.js');
const Type = new mongoose.Schema({
	name:String,
	user:String,
	date:Date,
	parentId:{type:mongoose.Schema.Types.ObjectId,ref:'type'},
	discription:String,
	imgUrl:String,
	article:String,
	type:{
		type:String,
		default:'list'
	},
	link:String,
	rank:{
		type:Number,
		default:0
	},
	page:String
});
module.exports = mongoose.model('type',Type);