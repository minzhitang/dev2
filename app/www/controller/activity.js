var common   = require('@sina/koa-common');
var activity = require('model/activity');
var xhttp    = require('@sina/koa-xhttp');
var fs       = require("fs");
var parse    = require('co-body');
var memcached = require('lib/sysMemcached');
var redis = require('lib/sysRedis')();


exports.view = function *(next) {
    "use strict"
    if (this.method == 'GET') {
        // get
        // let key = 'activity_' + this.params.id;
        // var activityArr = yield memcached.get(key);
        // if (!activityArr) {
        //     activityArr = yield activity.getActivityByid( this.params.id );
        //     yield memcached.set(key,activityArr,1000);
        // };

        var key = 'activity_' + this.params.id;
        var activityArr = yield redis.get(key);
        if (!activityArr) {
            activityArr = yield activity.getActivityByid( this.params.id );
            yield redis.set(key, JSON.stringify(activityArr));
        }else{
            activityArr = JSON.parse(activityArr);
        }

    }else{
        // post
        var body = yield parse(this);
        console.log(body);
    }

    // http
    // let url = 'http://wangkun5.zhongce.sina.com.cn/activity/activity_lists/0/?page=1&format=json';
    // let header = {Referer: 'https://www.google.com.hk'};

    // let response = yield xhttp.get(url, header); //Yay, HTTP requests with no callbacks!
    // let a = yield xhttp.post( url, {a:1} );
    // let a = yield xhttp.upload( url, {a:1,file: fs.createReadStream('./static/images/arr.png')} );
    // let a = yield xhttp.download( 'http://sinastorage.com/storage.miaosha.sina.com.cn/products/201601/cc992ed4a8c8541f54642815169b8f60.jpg', 'a/b', '1.jpg' );
    // console.log(response.body);


    // jsonp
    // let activityArr = yield activity.getActivityByid( id );
    // console.log(activityArr);
    this.jsonpSucc = ['succ', activityArr];
    // this.jsonpError = ['error', activityArr];

    // display
    // this.body = yield this.render('activity_view', {
    //     v: this.state.v,
    //     isLogin: this.state.isLogin,
    //     s: 'activity',
    //     activityArr: activityArr
    // });
}

exports.show = function *(next) {
    "use strict"
    this.body = yield this.render('activity_show', {
        _csrf : this.csrf
    });
}