const Post = require('../model/post.js');
const User = require('../model/user.js');

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

module.exports = {
  post: (req, res, next) => {
       console.log('enter');
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
            console.log(total,other);
            postNum.push(total-other);
            res.locals.datas.postNum = postNum;
            res.locals.status = 1;
        })
        .then(()=>{
            next();
        })

    }
}
