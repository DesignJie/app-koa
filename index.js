/**
 * Created by pro on 15/4/14.
 */

var path = require('path'),
    koa = require('koa'),
    logger = require('koa-logger'),
    session = require('koa-generic-session'),
    router = require('koa-router'),
    serve = require('koa-static'),
    RedisStore = require('koa-redis'),
    render = require('koa-swig'),
    bodyparser = require('koa-bodyparser'),
    conditional = require('koa-conditional-get'),
    compress = require('koa-compress'),
    etag = require('koa-etag'),
    yargs = require('yargs').argv,
    async = require('async'),
    _ = require('lodash');

var db = require('./controller/db/index');
var redis_config = require('./config/redis_config.json');
var routes = require('./routes/index');

var app = module.exports = koa();

app.use(compress());  //gzip 压缩
app.use(serve(__dirname + '/static')); //设置静态文件路径
app.use(logger()); //logger 提示
app.use(bodyparser({
    extendTypes : {
        json : ['application/x-javascript']
    }
}));

//get 304 缓存页面
app.use(conditional());
app.use(etag());

//session
app.keys = ['mjdkdichkpnhlpasxgnlhdxvocpsgzopyhyfhilyyraakxswcl'];
app.use(session({
  store: new RedisStore(redis_config.redis)
}));

//router
app.context.render = render({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody : true
//    locals: locals,
//    filters: filters,
//    tags: tags,
//    extensions: extensions
});

app.use(router(app));

routes(app);

app.listen(3000);

console.log('listen success to 3000');
