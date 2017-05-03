const mongoose = require('../config.db.js');
const Schema = new mongoose.Schema({
	title:String,
	pulishDate:{
		type:Date,
		default:new Date()
	},
	user:String,
	contact:String,
	address:String,
	email:String,
	file:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'file'
	},
	isChecked:{
		type:Boolean,
		default:false
	}
})
module.exports = mongoose.model('paper',Schema);