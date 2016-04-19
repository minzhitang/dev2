'use strict';

/**
 * 一个比较悲伤的事实是koa-router暂时不支持正则。。。。
 * @type {[type]}
 */
var Router = require('koa-router');

/**
 * 多app 需要实现多个路由
 * @type {[type]}
 */
var wwwRouter = new Router();
var adminRouter = new Router();

/**
 * 引入控制器
 * @type {[type]}
 */
var wwwIndex = require('app/www/controller/index');
var wwwActivity = require('app/www/controller/activity');
var wwwWeb = require('app/www/controller/web');
var wwwToken = require('app/www/controller/token');

var adminIndex = require('app/admin/controller/index');
var adminActivity = require('app/admin/controller/activity');

/**
 * 前台路由
 */
wwwRouter.post('/index', wwwIndex.rec);
// wwwRouter.get('/activity/view/:id', wwwActivity.view);
wwwRouter.get('/booklist/:list_id', wwwWeb.booklist);
wwwRouter.get('/token/flush', wwwToken.flush);
// wwwRouter.post('/activity/view/:id', wwwActivity.view);
// wwwRouter.get('/activity/show', wwwActivity.show);

/**
 * 后台路由
 */
adminRouter.get('/', adminIndex.index);
// adminRouter.get('/activity/view/:id', adminActivity.view);

/**
 * 匹配路由
 * @param  obj   obj [description]
 * @return {[type]}       [description]
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2016-01-19
 */
module.exports.www = wwwRouter;
module.exports.admin = adminRouter;