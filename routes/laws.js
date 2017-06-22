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
        conditions.title = {$in:req.query._k.split(conditions).map((ele)=> new RegExp(`/${ele}/i`))}
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
                }else{
                    result = result.map(ele=>{
                        ele = ele.toObject();
                        ele.publishDate = moment(ele.publishDate).format('YYYY-MM-DD')
                        return ele;
                    })
                    return result;
                }
            })
}

function countLawsList(req){
    let conditions = {
        typeId:'59267491ae9782082cf1d8b7'
    };
    if(req.query._k){
        conditions.title = {$in:req.query._k.split(conditions).map((ele)=> new RegExp(`/${ele}/i`))}
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
        res.locals.datas = result;
        res.locals.status = 1;
        next();
    })
    .catch(err=>{
        console.log(err);
        next();
    })

}
