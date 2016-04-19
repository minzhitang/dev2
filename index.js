'use strict';

/**
 * koa middleware
 * https://github.com/koajs/koa/wiki
 *
 * @todo
 * koa-csrf 加上有点问题，待查
 */

var app          = require('koa')();
var userAgent    = require('koa-useragent');
var favicon      = require('koa-favicon');
var session      = require('koa-session');
var staticServer = require('koa-static');
var log          = require('lib/sysLog');
var jsonp        = require('@sina/koa-jsonp');

/**
 * cors支持，大数据量跨域请求，未安装，有需要的情况下自行安装
 * https://github.com/evert0n/koa-cors
 */

// var cors         = require('koa-cors');

/**
 * init config
 * @type {[type]}
 */
var init = require('lib/sysInit');

/**
 * error
 * @type {[type]}
 */
var error = require('lib/sysError');

/**
 * router
 * @type {[type]}
 */
var routerConfig = require('config/router');

/**
 * init session cookie
 * @type {Array}
 */
app.keys = [init.config.sessionSecret];
app.use(session(app));

/**
 * user-agent
 */
app.use(userAgent());

/**
 * favicon
 */
app.use(favicon(init.config.STATIC_PATH + '/favicon.ico'));

/**
 * app识别
 * @type {[type]}
 */
var configure    = require('config/configure');
app.use(configure());
/**
 * 模板渲染接口
 * @type {[type]}
 */
var render       = require('lib/sysRender');


/**
 * 捕捉错误记录到PM2的错误日志
 * @param  {[type]}   err  [description]
 * @param  {[type]}   ctx) {               log.error(err);} [description]
 * @return {[type]}        [description]
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2016-01-19
 */
app.on('error', function(err, ctx) {
    log.error(err);
});

/**
 * static middleware
 * @TODO maxage
 */
app.use(staticServer(init.config.STATIC_PATH));

/**
 * json/jsonp
 */
jsonp(app);

/**
 * cors
 * @type {Object}
 */
// let corsOptions = {
//     origin: 'http://www.sina.com.cn',
//     credentials: true,
//     methods: ['GET', 'POST']
// };
// app.use(cors(corsOptions));

app.use(function*(next) {
    // koa 推荐用来保存那些通过中间件传递给试图的参数或数据的命名空间
    // this.state.v = xxx;

    // yield configure.call(this);
    yield render.call(this);

    yield next;
});

/**
 * router
 */
app.use(function*(next) {
    yield routerConfig[this.APP].routes().call(this, next);
});

/**
 * error
 */
app.use(error(init));

// webSocket
// var chat = require('app/test/test');
// var server = require('http').Server(app.callback());
// chat.initialize(server);

for (let port of init.config.PORT) {
    // 普通网站运行
    app.listen(port);

    // webSocket 运行
    // server.listen(port);
    console.log(init.config.PROJECT_NAME + ' Listening on ' + port);
}
