'use strict';

var common     = require('@sina/koa-common');
var appConfig  = require('config/config');
var baseConfig = require('@sina/koa-config');

/**
 * init
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2015-12-31
 */
class Init{

    constructor() {
        this.appConfig = appConfig;
        this.baseConfig = baseConfig;
        this.config = {};

        // 标志config是否处理完成
        this.flag = false;

        if (!this.flag) {
            this._initEnv();
            this._initAppConfig();
            this.config = common.objMerge(this.baseConfig, this.appConfig);
            this._checkConfig();
            this._initConfig();
        }
    }

    _initEnv() {
        let env = process.env.NODE_ENV || 'production';
        process.env.NODE_ENV = env.toLowerCase();
        console.info('NODE_ENV: %s', process.env.NODE_ENV);
    }

    _initAppConfig() {
        this.appConfig.PORT         = process.env.PORT.split(',') || [];
        this.appConfig.PROJECT_NAME = process.env.PROJECT_NAME || '';
        this.appConfig.PROJECT_HOST = process.env.PROJECT_HOST || '';
        this.appConfig.DATABASE     = JSON.parse(process.env.DATABASE) || {};
        this.appConfig.MEMCACHED    = JSON.parse(process.env.MEMCACHED) || {};
        this.appConfig.REDIS        = JSON.parse(process.env.REDIS) || {};
        this.appConfig.S3           = JSON.parse(process.env.S3) || {};
    }

    _checkConfig() {
        if (!this.config.PROJECT_NAME) {
            var err = new Error('PROJECT_NAME 不能为空');
            err.status = 500;
            err.errCode = 4;
            throw err;
        };

        if (!common.isArray(this.config.PORT) || this.config.PORT.length == 0) {
            var err = new Error('PORT 不能为空');
            err.status = 500;
            err.errCode = 4;
            throw err;
        };

        if (typeof (this.config.APP_PATH) != 'string' || !this.config.APP_PATH) {
            var err = new Error('APP_PATH 不能为空');
            err.status = 500;
            err.errCode = 4;
            throw err;
        };

        if (typeof (this.config.STATIC_PATH) != 'string' || !this.config.STATIC_PATH) {
            var err = new Error('STATIC_PATH 不能为空');
            err.status = 500;
            err.errCode = 4;
            throw err;
        };

        if ( this.config.vt == 1 && !this.config.VT_DIR ) {
            var err = new Error('VT_DIR 不能为空');
            err.status = 500;
            err.errCode = 4;
            throw err;
        };
    }

    _initConfig() {
        // sessionSecret
        if (!this.config.sessionSecret) {
            this.config.sessionSecret = this.config.PROJECT_NAME;
        };

        // redis
        if (!this.config.REDIS.master.options.prefix) {
            this.config.REDIS.master.options.prefix = this.config.PROJECT_NAME;
        }

        if (!this.config.REDIS.slave.options.prefix) {
            this.config.REDIS.slave.options.prefix = this.config.PROJECT_NAME;
        }

        // memcached
        if (!this.config.MEMCACHED.options.namespace) {
            this.config.MEMCACHED.options.namespace = this.config.PROJECT_NAME;
        }

        this.flag = true;
    }
}

/**
 * @param  obj   obj           请求
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2015-12-31
 */
Init.prototype.checkReferer = function *(reqObj) {
    switch (reqObj.method){
        case 'GET':
            break;
        case 'POST':

            // @TODO
            // if (BaseModelSwitch::check('postRefererCheck') === true) {
            if (true) {
                let forbid = true;
                let isAllow = yield common.inArray(req.host, this.config.acceptReferer);
                if (reqObj.header.referer.indexOf(req.host) > -1 && isAllow) {
                    forbid = false;
                    break;
                }

                if (forbid) {
                    let err = new Error('请求源不允许90100[' + reqObj.header.referer + ']');
                    err.status = 500;
                    err.errCode = 90100;
                    throw err;
                }
            }

            break;
        case 'HEAD':
            break;
        default:
            let err = new Error('请求源不允许90100');
            err.status = 500;
            err.errCode = 90100;
            throw err;
    }
};

module.exports = new Init();
