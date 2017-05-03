/*
	志愿招募
 */
const mongoose = require('../config.db.js');
const Schema = new mongoose.Schema({
	title:String,
	file:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'file'
	},
	publishDate:Date,
	user:String,
	checked:{
		type:Boolean,
		default:false
	}
})
module.exports = mongoose.model('proposer',Schema);