const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
module.exports = {
	session:{
		secret:'cashely',
		resave:true,
		key:'cashely',
		saveUninitialized: true,
  		cookie: {expires: 60*1000*60},
  		expires:60*1000*60,
  		store:new MongoStore({
  			url:'mongodb://localhost:27017/webJfs'
  		})
	},
	hisAddress:'http://192.168.1.234:80/'
}