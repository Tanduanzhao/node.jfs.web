const Post = require('../model/post.js');
const User = require('../model/user.js');
const Doc = require('../model/doc.js');
const feedback = require('../model/feedback.js');
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');

//获取用户列表
function getUserList() {
  return User.find().select('username').exec()
}

//获取总文章数
function getPostTotal() {
  return Post.count().exec()
}

// 按照用户名获取文章数
function getPostByUserName(name) {
  return Post.count().where({publishUser: name}).exec()
}
//获取所有投诉时间列表
function getFeedbackTimes(){
    return new Promise((resolve,reject)=>{
        feedback
          .find()
          .select('publishDate')
          .exec((err,result)=>{
              if(err){
                  throw new Error('查询用户投诉时间失败!')
              }else{
                  let arrMonth=[],arr=[];
                  result.forEach((item)=>{
                      if(!!item.publishDate){
                          arrMonth.push(item.publishDate.getFullYear()+"年"+(item.publishDate.getMonth()+1)+"月");
                      }
                  })
                  arrMonth=getFeedbackNum(arrMonth);
                  resolve(arrMonth);
              }
          })
    })
}

//获取所有城市列表
function getCitys(){
    return new Promise((resolve,reject)=>{
        Doc
            .find()
            .select('city')
            .exec((err,result)=>{
                if(err){
                    throw new Error('查询投稿地区失败!')
                }else{
                    let arr = obj2Array(result);
                    arr = getArrFromCitys(arr);
                    arr = removeSameValueFromArr(arr);
                    resolve(arr);
                }
            })
    })
}
//对象值数组转string数组
function obj2Array(obj){
    let _arr = [];
    obj.forEach((item)=>{
        if(!!item.city){
            _arr.push(item.city)
        }
    })
    return _arr;
}
//数组去重
function removeSameValueFromArr(arr){
    let newArr = [];
    arr.forEach((item)=>{
        if(newArr.indexOf(item) === -1){
            newArr.push(item)
        }
    })
    return newArr;
}
//统计每月用户投诉数量
function getFeedbackNum(arr){
    let newArr = [];
    arr.forEach((item,index)=>{
        if(newArr[item]!==undefined){
            newArr[item]++;
        }else{
            newArr[item]=1;
        }
    })
    return newArr;
}
//获取所有的投稿总量
function getDocTotal(){
    return Doc
            .count()
}
//字符串取城市名
function getArrFromCitys(arr){
    let newArray = arr.map((item)=>{
        item = item.split('-');
        return item[1];
    })
    return newArray;
}
//按照城市名获取每个地市投稿数量
function getNumByCityName(name){
    return Doc
            .count()
            .where({city:new RegExp(name)})
}

module.exports = {
  post: (req, res, next) => {
        let userList = [],
          total,
          postNum = [],
          other = 0;

        getPostTotal()
        .then((count) => {
          total = count;
          res.locals.datas = {};
          res.locals.datas.total = total;
          return getUserList()
        })
        .then((result) => {
          result.forEach((ele) => {
             userList.push(ele.username);
             postNum.push(getPostByUserName(ele.username))
          });
          res.locals.datas.userList = userList;
          return Promise.all(postNum)
        })
        .then((_r) => {
            postNum = _r;
            userList.push('其他');
            postNum.forEach((num) => {
                other += num;
            })
            postNum.push(total-other);
            res.locals.datas.postNum = postNum;
            res.locals.status = 1;
        })
        .then(()=>{
            next();
        })
    },
    feedback: (req, res, next) => {
        let month = [],
          monthNum = [];

        getFeedbackTimes()
          .then((result)=>{
              for(var key in result){
                  monthNum.push(result[key]);
                  month.push(key)
              }
              res.locals.datas = {};
              res.locals.datas.monthNum = monthNum;
              res.locals.datas.month = month;
              res.locals.status = 1;
          })
          .then(()=>{
              next()
          })
    },
    feedbackExcel:(req,res,next)=>{
        let month = [], monthNum = [],totalFeedback= 0;

        getFeedbackTimes()
          .then((result)=>{
              for(var key in result){
                  monthNum.push(result[key]);
                  month.push(key);
                  totalFeedback+=result[key];
              }
              return result;
          })
          .then(()=>{
              let data = [[...month,'总计'],[...monthNum,totalFeedback]];
              let buffer = xlsx.build([{name:"用户投诉统计分析",data:data}]);
              let filePath = '/excels/',fileName = 'total.'+(+new Date())+'.xlsx';
              fs.writeFile('./public'+filePath+fileName,buffer,'binary',(err,_result)=>{
                  if(err){
                      throw new Error('创建excel失败!');
                  }
                  res.sendFile(path.join(__dirname,'../public/'+filePath)+fileName);
              })
               //next()
          })
    },
    doc:(req,res,next)=>{
        let city=[],values=[],total,other = 0;

        getDocTotal()
        .then((result)=>{
            total = result;
            res.locals.status = 1;
            res.locals.datas = {};
            res.locals.datas.total = total;
            return getCitys();
        })
        .then((result)=>{
            city = result;
            return result;
        })
        .then((result)=>{
            result.forEach((item)=>{
                values.push(getNumByCityName(item))
            })
            return Promise.all(values);
        })
        .then((result)=>{
            values = result;
            values.forEach((num)=>{
                other += num;
            })
            values.push(total-other);
            city.push('其他');
            res.locals.datas.city = city;
            res.locals.datas.values = values;
        })
        .then(()=>{
            next()
        })
    },
    docExcel:(req,res,next)=>{
        let city=[],values=[],total,other = 0;

        getDocTotal()
        .then((result)=>{
            total = result;
            res.locals.status = 1;
            return getCitys();
        })
        .then((result)=>{
            city = result;
            return result;
        })
        .then((result)=>{
            result.forEach((item)=>{
                values.push(getNumByCityName(item))
            })
            return Promise.all(values);
        })
        .then((result)=>{
            values = result;
            values.forEach((num)=>{
                other += num;
            })
            values.push(total-other);
            city.push('其他');
        })
        .then(()=>{
            let data = [[...city,'总计'],[...values,total]];
            let buffer = xlsx.build([{name:"用户文章统计分析",data:data}]);
            let filePath = '/excels/',fileName = 'total.'+(+new Date())+'.xlsx';
            fs.writeFile('./public'+filePath+fileName,buffer,'binary',(err,_result)=>{
                if(err){
                    throw new Error('创建excel失败!');
                }
                res.sendFile(path.join(__dirname,'../public/'+filePath)+fileName);
            })

            // next()
        })
    }
}
