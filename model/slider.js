const mongoose = require('../config.db.js');
const Schema = new mongoose.Schema({
	title:String,
	path:String,
	isLink:{
		type:Boolean,
		default:false
	},
	link:String,
	deep:{
		type:Number,
		default:0
	},
	publishDate:{
		type:Date,
		default:new Date()
	}
})
module.exports = mongoose.model('slider',Schema);