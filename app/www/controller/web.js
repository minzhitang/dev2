// h5的页面

// var render = require('lib/sysRender')();
// var comment = require('model/comment');
var parse = require('co-body');


var book = require('model/book');
var book_list = require('model/book_list');

/**
 * 根据booklist_id获取书单
 * @yield  {[type]}   [description]
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-02-23
 */
exports.booklist = function * ( ) {
    "use strict"
    // let data = yield parse(this);
    // console.log(data);
    console.log(this.params);
    let list_info = yield book_list.getListById(this.params.list_id);
    // console.log(list_info);
    if (!list_info) {
        this.body = yield this.render('error', {
            'msg' : '对不起，找不到，id不太对吧'
        });
    }
    else {
        console.log(list_info);
        let books = JSON.parse(list_info.content);

        let show_list = [];
        for (let b of books) {
            b['book_info'] = yield book.getBook(b.book_id);
            show_list.push(b);
        }
        if (show_list.length > 0) {
            this.body = yield this.render('book_list', {
                'book_list' : show_list,
                'title'     : list_info.title
            });
        }
    }
}