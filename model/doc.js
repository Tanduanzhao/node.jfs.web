var mongoose =require('../config.db.js');
var Schema = new mongoose.Schema({
	title:String,
	publishDate:{
		type:Date,
		default:new Date()
	},
	user:String,
	contact:String,
	city:String,
	address:String,
	email:String,
	file:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'file'
	},
	isOpen:{
		type:Number,
		default:0
	},
	company:String
})

module.exports = mongoose.model('doc',Schema);
