'use strict';

var path = require('path');

const config = {

    /**
     * session secret
     * @type {String}
     */
    sessionSecret: '',

    /**
     * 允许POST的域
     * @type {Array}
     */
    acceptReferer: ['sina.com.cn', 'weibo.com', 'sina.cn', 'weibo.cn'],

    /**
     * 项目根目录
     * @type {String}
     */
    ROOT_PATH: path.dirname(__dirname),

    /**
     * 项目配置目录
     * @type {String}
     */
    CONFIG_PATH: __dirname,

    /**
     * APP目录
     * @type {String}
     */
    APP_PATH: path.join(path.dirname(__dirname), 'app'),

    /**
     * 项目模型目录
     * @type {String}
     */
    MODEL_PATH: path.join(path.dirname(__dirname), 'model'),

    /**
     * 项目静态文件目录，必填
     * @type {String}
     */
    STATIC_PATH: path.join(path.dirname(__dirname), 'static'),

    /**
     * 核心文件目录，必填
     * @type {String}
     */
    LIB_PATH: path.join(path.dirname(__dirname), 'lib'),

    /**
     * 模板目录
     * @type {String}
     */
    TEMPLATE_PATH: '',

    /**
     * 开启自动适配到wap模板
     * 1 开启
     * 0 关闭，default
     * @type {Number}
     */
    vt: 1,

    /**
     * 存放wap模板的目录，必须放在views下边，目录需要手动创建
     * @type {String}
     */
    VT_DIR: 'vt_4',
};

module.exports = config;
