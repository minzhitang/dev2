'use strict';

var render = require('koa-swig');
var init   = require('lib/sysInit');
var path   = require('path');

/**
 * 初始化模板处理函数
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2016-01-19
 */
module.exports = function*(next) {
    _checkVt.call(this);
    let _templatePath = path.join(init.config.APP_PATH, this.APP, 'views');
    if (Number.parseInt(this.query.vt) === 4) {
        _templatePath = path.join(_templatePath, init.config.VT_DIR);
    };
    init.config.TEMPLATE_PATH = _templatePath;
    init.config.render_config.root = _templatePath;

    this.render = render(init.config.render_config);
};

/**
 * 识别UA头,增加vt参数,并提供302跳转
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2016-01-22
 */
function _checkVt() {
    var vt = 0;
    if (init.config.vt) {
        // 获取到的vt
        vt = this.query.vt ? Number.parseInt(this.query.vt) : vt;

        // 检测到的vt
        let result = getVt(this.state.userAgent.source);

        if (vt !== result) {
            if (result === 0) {
                // pc环境下带参数vt的，删掉
                delete this.query.vt;
            }else {
                // 非pc下没有任何参数的，加上参数vt  else if(this.querystring === '')
                // 非pc下有带参数vt的，把vt纠正成系统检测到的   else if(this.query.vt)
                // 非pc下没有带参数vt的，加上参数vt else{}
                this.query.vt = result;
            }

            var host = this.host;
            if (result === 4) {
                //wap，至sina.cn域
                host = host.replace('sina.com.cn', 'sina.cn');
            }else {
                //非wap，至sina.com.cn域
                host = host.replace('sina.cn', 'sina.com.cn');
            }

            // 这块必须得重新赋值，会同步更新obj.url，否则obj.url不变
            this.query = this.query;
            this.redirect(this.protocol + '://' + host + this.url);
        };
    }
}

/**
 * 根据UA检测vt参数
 * @param  string   ua user-agent
 * @return int      检测到VT
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2016-01-22
 */
function getVt(ua) {
    var result = null;
    if (ua.match(/iPad|Windows (?:98|95|ME|NT)|Macintosh|Linux.*x11|x11.*Linux|(?:web|hpw)OS/i)) {
        result = 0;
    } else if (ua.indexOf('Mobile')) {
        result = 4;
    } else if (ua.match(/Android(?: )?(?:AllPhone_)?(?:\/)?([0-9.]*)/) >= 3) {
        result = 0;
    } else if (ua.match(/iPhone|iPod|Adr|MeeGo|BlackBerry.*6|Symbian\/3|Windows Phone/)) {
        result = 4;
    } else {
        result = 1;
    }

    return result;
}
