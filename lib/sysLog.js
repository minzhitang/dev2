"use strict"

/**
 * 送报警中心的临时日志
 * @param  string   msg
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2015-12-31
 */
module.exports.sendTmpLog = function(msg) {

}

/**
 * 普通错误记录，由PM2自动捕捉记录
 * @param  string   msg
 *
 * @author wangkun5 <wangkun5@staff.sina.com.cn>
 * @date   2015-12-31
 */
module.exports.error = function(msg) {
    console.trace(msg);
}