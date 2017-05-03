const mongoose = require('../config.db.js');
let File = new mongoose.Schema({
	name:String,
	path:String,
	name:String
})
module.exports = mongoose.model('file',File);