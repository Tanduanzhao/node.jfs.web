var request = require('request');
var fs = require('fs');
var filePath = __dirname + '/date.js';
console.log('存储文件地址:',filePath);
request({uri:'http://hotel.qunar.com/city/singapore_city/#fromDate=2017-03-02&cityurl=singapore_city&from=globalhotelpages&toDate=2017-03-03&QHFP=GHI0_4210054'},function(err,res,body){
	
}).pipe(fs.createWriteStream(filePath));
