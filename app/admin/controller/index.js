// var config  = require('model/config');

exports.index = function *(next) {
    "use strict"
    // let configArr = yield config.getConfig();
    this.body = yield this.render('index_view', {
        v: this.state.v,
        isLogin: this.state.isLogin,
        s: 'index',
        app : 'amdin'
    //     configArr: configArr
    });
}