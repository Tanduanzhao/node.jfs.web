const post = require('../model/post.js');
const moment = require('moment');
const page = {
    size:20,
    num:1
}
function getLawsList(req){
    let conditions = {
        typeId:'59267491ae9782082cf1d8b7'
    };
    if(req.query._k){
        conditions.title = new RegExp(req.query._k);
    }
    return post
            .find()
            .where(conditions)
            .select('_id publishDate title')
            .skip((page.num-1)*page.size)
            .limit(page.size)
            .sort({publishDate:-1})
            .exec((err,result)=>{
                if(err){
                    throw new Error('查询政策法规文章失败！');
                    console.log(err);
                }
            })
}

function countLawsList(req){
    let conditions = {
        typeId:'59267491ae9782082cf1d8b7'
    };
    if(req.query._k){
        conditions.title = new RegExp(req.query._k);
    }
    return new Promise((resolve,reject)=>{
        post
            .count()
            .where(conditions)
            .exec((err,count)=>{

                    if(err){
                        reject('统计政策法规文章出错');
                    }else{
                        resolve(count);
                    }
            })
    })
}



module.exports = (req,res,next)=>{
    if(req.query.page){
        page.num = req.query.page * 1;
    }
    countLawsList(req)
    .then((count)=>{
        page.total = count;
        res.locals.page = page;
        return getLawsList(req)
    })
    .then((result)=>{
        result = result.map(ele=>{
            ele = ele.toObject();
            if(!!ele.publishDate){
                ele.publishDate = moment(ele.publishDate).format('YYYY-MM-DD')
            }else{
                ele.publishDate = '不详';
            }
            return ele;
        })
        res.locals.datas = result;
        res.locals.status = 1;
        next();
    })
    .catch(err=>{
        console.log(err);
        next();
    })

}
