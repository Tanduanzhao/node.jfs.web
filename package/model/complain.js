const mongoose = require('../config.db.js');
const Schema = mongoose.Schema({
	user:String,
	email:String,
	contact:String,
	address:String,
	content:String,
	publishDate:{
		type:Date,
		default:new Date()
	}
})