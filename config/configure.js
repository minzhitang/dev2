'use strict';

/**
 * app识别
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2016-04-06
 */
module.exports = configure;

function configure() {
    return function * configure(next) {
        let host = this.request.host;
        // 多app, 单app直接定义即可，不需要做这些判断
        if (host.indexOf('admin.zhongce') > -1) {
            this.APP = 'admin';
        }else {
            this.APP = 'www';
        }
        yield next;
    };
}