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
    etag = require('koa-etag'),
    yargs = require('yargs').argv,
    async = require('async'),
    _ = require('lodash');

var db = require('./controller/db/index');
var redis_config = require('./config/redis_config.json');
var routes = require('./routes/index');

var app = module.exports = koa();

app.use(serve(__dirname + '/static'));
app.use(logger());
app.use(bodyparser());

//get 304
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
