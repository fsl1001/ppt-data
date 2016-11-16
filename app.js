//create by fsl 20161111
var debug = require('debug')('ppt-data');
var koa = require('koa');
var config = require('./config/config'); //配置文件 
var Logger = require('mini-logger'); //log记录
var onerror = require('koa-onerror'); //错误处理
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var validator = require('koa-validator');
var staticCache = require('koa-static-cache');
var router = require('koa-router');
var serve = require('koa-static');

var app = koa();
app.use(function *(next){
    //config 注入中间件，方便调用配置信息
    if(!this.config){
        this.config = config;
    }
    yield next;
});
var logger = Logger({
    dir: config.logDir,
    categories: [ 'http' ],
    format: 'YYYY-MM-DD-[{category}][.log]'
});
logger.http('http request url: %s', 'https://github.com');
//router use : this.logger.error(new Error(''))
app.context.logger = logger;
onerror(app);

app.use(session(app));
//post body 解析
app.use(bodyParser());
//数据校验
app.use(validator());
//静态文件cache
var staticDir = config.staticDir;
app.use(staticCache(staticDir+'/js'));
app.use(staticCache(staticDir+'/css'));

app.use(serve(__dirname + '/public'));

//路由
app.use(router(app));
//应用路由
var appRouter = require('./router/index');
appRouter(app);
app.listen(config.port);
console.log('listening on port %s',config.port);

module.exports = app;

