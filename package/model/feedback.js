const mongoose = require('../config.db.js');
const Schema = mongoose.Schema({
	user:String,
	email:String,
	contact:String,
	address:String,
	title:String,
	content:String,
	publishDate:{
		type:Date,
		default:new Date()
	},
	checked:{
		type:Boolean,
		default:false
	},
	replay:String,
	replayTime:Date
})
module.exports = mongoose.model('feedback',Schema);