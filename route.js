// modules
const admin = require('./routes/admin/index.js');
const login = require('./routes/admin/login.js');
const user = require('./routes/admin/user.js');
const post = require('./routes/admin/post.js');
const category = require('./routes/admin/category.js');
const setting = require('./routes/admin/setting.js');
const classify = require('./routes/admin/classify.js');
const slider = require('./routes/admin/slider.js');
const md5 = require('./modules/md5.js');
const uploads = require('./routes/uploads.js');

const index = require('./routes/index.js');
const search = require('./routes/search.js');
const article = require('./routes/post.js');
const news = require('./routes/news.js');
const jkcj = require('./routes/jkcj.js');
const policy = require('./routes/policy.js');
const train = require('./routes/train.js');
const org = require('./routes/org.js');
const info = require('./routes/info.js');
const nav = require('./routes/nav.js');
const doc = require('./routes/doc.js');
const services = require('./routes/services.js');
const proposer = require('./routes/proposer.js');
const supervise = require('./routes/supervise.js');
const feedback = require('./routes/feedback.js');
const service = require('./routes/service.js');
const scientific = require('./routes/scientific.js');
const paper = require('./routes/paper.js');
const total = require('./routes/total.js');

const Post = require('./model/post.js');

/* GET home page. */
module.exports = function(app) {
    app
    	.get('*', function(req, res, next) {
            res.locals.title = '广东省结核病控制中心';
            next();
        })

        //首页
        .get('/', index)
        //搜索结果页
        .get('/search',search)
        //文章页面   id
        .get('/post/:id',article)
        //新闻动态
        .get(['/news','/news/:type'],news)
        //健康促进
        .get(['/jkcj','/jkcj/:type'],jkcj)
        //政策发布
        .get(['/policy','/policy/:type'],policy)
        //科研培训
        .get(['/train','/train/:type'],train)
        //防痨协会
        .get(['/org','/org/:type'],org)
        //信息公开
        .get(['/info','/info/:type'],info)
        //纪检监察
        .get(['/supervise','/supervise/:type'],supervise)
        //诊疗服务
        .get(['/service','/service/:type'],service)
        //获取所有导航
        .get('/nav',nav)
        //根据地名结控网络查找对应文章
        .get('/netWorkArticleId',function(req,res){
            let name = req.query.place;
            Post
                .findOne()
                .where({title:name})
                .select('_id')
                .exec((err,result)=>{
                    if(err){
                        throw new Error('根据地名获取文章错误!')
                    }else{
                        res.json(result)
                    }
                })


        })




        //生成密码
        .get('/getMd5', md5)

    	.get('/admin', admin)
        .all('*', function(req, res, next) {
            res.locals.status = 0;
            next();
        })
        //投稿
        .get('/docs',doc.list)
        .post('/docs',doc.add)
        //志愿者列表
        .get('/proposer',proposer.list)
        //志愿者申请
        .post('/proposer',proposer.add)
        //投诉建议
        .post('/feedback',feedback.add)
        //投诉列表
        .get('/feedback',feedback.list)
        //获取单个投诉列表
        .get('/feedback/:id',feedback.single)
        //回复投诉
        .post('/feedback/:id',feedback.rePlay)
        //获取服务项目列表
        .get('/services',services.list)
        //获取医生列表
        .get('/doctors',services.doctors)
        //获取科研队伍分类介绍
        .get('/scientificTeam',scientific.team)
        .get('/scientificItem',scientific.item)
        //发表论文
        .post('/paper',paper.add)
        //获取论文列表
        .get('/paper',paper.list)
        //获取单篇论文
        .get('/paper/:id',paper.single)
        //统计
          //--文章
        .get('/total/post',total.post)
          //--投诉
        .get('/total/feedback',total.feedback)
        //--获取投诉统计excel
        .get('/feedbackDownload/:date',total.feedbackExcel)
          //--投稿
        .get('/total/doc',total.doc)
          //--获取文章统计excel
        .get('/download/:date',total.docExcel)

        //微门户
        .get('/ww',function(req,res,next){
            res.render('ww');
        })
        //正在建设中
        .get('/ing',function(req,res,next){
            res.render('ing');
        })


        //获取类型分类
        .get('/classify',classify)
        //登录
        .post('/admin/login', login.in)
        //注销
        .post('/admin/loginOut', login.out)
        //验证用户是否已经登录
        .post('/admin/logined', login.has)
        .get('/admin/userInfo', user.info)
        //获取文章列表
        .get('/admin/post', post.list)
        .get('/admin/post/:id', post.single)
        //添加文章
        .put('/admin/post', post.add)
        //更新文章
        .post('/admin/post/:id', post.update)
        .delete('/admin/post/:id', post.delete)
        //获取分类列表-category
        .get('/admin/category', category.list)
        //获取单个分类
        .get('/admin/category/:id', category.single)
        //新增分类
        .put('/admin/category', category.add)
        //更新分类
        .post('/admin/category/:id', category.update)
        //获取某分类下面的所有文章
        .get('/admin/category/list/:id', category.postList)
        //删除分类
        .delete('/admin/category/:id', category.delete)
        //获取用户列表
        .get('/admin/users', user.list)
        .get('/admin/user/:id', user.single)
        //添加用户
        .post('/admin/user', user.add)
        //更新用户
        .post('/admin/user/:id', user.update)
        //网站设置
        .get('/admin/setting',setting.info)
        .put('/admin/setting',setting.update)
        // 获取幻灯片列表
        .get('/admin/slider',slider.list)
        //获取单幻灯片列表:id
        // .get('/admin/slider/:id',slider.single)
        //新增幻灯片
        // .post('/admin/slider',slider.add)
        //更新幻灯片:id
        // .put('/admin/slider/:id',slider.update)
        //上传图片
        .post('/uploads',uploads)
        .all('*', function(req, res) {
            res.status(200);
            res.json(res.locals);
        })
}
