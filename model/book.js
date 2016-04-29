// 对tags，book，user_book的操作
var tbl_tags = require('lib/sysMysql')('tbl_tags');
var tbl_drawing = require('lib/sysMysql')('tbl_drawing');
var tbl_drawing_tag_rel = require('lib/sysMysql')('tbl_drawing_tag_rel');

/**
 * 根据keyword出绘本标签
 * @param  {String}   keyword       关键词
 * @yield  {List}     标签列表
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-02-09
 */
exports.searchTag = function * ( keyword ) {
    "use strict"
    // type = type || '';

    // @todo: mysql的first函数会报错
    let tags = yield tbl_tags.select('id, tag_type, tag_value').where({
        tag_value : {sign : 'like', val : '%' + keyword + '%'},
        status    : 0 
    }).all();

    return tags;
}

/**
 * 根据标签id获取绘本列表
 * @param  {Integer}   tag_id        标签ID
 * @param  {Integer}   page          页码，默认为第1页
 * @param  {Integer}   size          每页条数，默认为4条（微信一屏4条合适）
 * @yield  {List}      绘本列表或者false
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-02-14
 */
exports.getBookByTag = function * ( tag_id, page, size ) {
    "use strict"
    page = Number.parseInt(page) > 0 ? Number.parseInt(page) : 1;
    size = Number.parseInt(size) > 0 ? Number.parseInt(size) : 4;

    let book_ids = yield tbl_drawing_tag_rel.select('drawing_id').where({
        tag_id : tag_id,
        status : 0
    }).orderBy({'drawing_id':'desc'}).limit(page, size).all();

    console.log(book_ids);

    if ( !book_ids || (0 == book_ids.length) || ( 0 == book_ids[0].num )) {
        return false;
    }

    // console.log(book_ids);
    let book_list = [];
    for (let row of book_ids) {
        // console.log(row);
        let book = yield tbl_drawing.select('id, book_name, jd_book_url, author, picture').where({
            id     : row.drawing_id,
            status : 0
        }).one();
        // console.log(book);
        book_list.push(book);
    }
    return book_list.length > 0 ? book_list : false;
}

/**
 * 根据id获取绘本内容
 * @param  {Integer}   book_id       绘本ID
 * @yield  {Object}    一本书的全部信息
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-02-09
 */
exports.getBook = function * ( book_id ) {
    "use strict"
    let book_info = yield tbl_drawing.select('*').where({id : book_id, status : 0}).one();
    return book_info;
}

/**
 * 根据书名搜索绘本
 * @param  {String}   book_name     书名
 * @yield  {List}     绘本列表或者false
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-02-14
 */
exports.searchName = function * ( book_name ) {
    "use strict"
    // @todo 之后orderBy评分
    let book_list = yield tbl_drawing.select('*').where({
        book_name : {
            'sign' : 'like',
            'val'  : '%' + book_name + '%'
        },
        status : 0
    }).orderBy({'id':'desc'}).limit(1, 10).all();
    console.log(book_list);
    if ( !book_list || (0 == book_list[0].num )) {
        return false;
    }
    return book_list;
}

/**
 * 获取需要抓取豆瓣
 * @param  {[type]}   tried_in_douban 尝试抓豆瓣的状态，0未抓，1已抓
 * @param  {[type]}   num             条数
 * 
 * @yield  {[type]}   [description]
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-04-25
 */
exports.getDoubanBookList = function * ( tried_in_douban, num ) {
    "use strict"
    let book_list = yield tbl_drawing.select('id, book_name, isbn, isbn10').where({
        tried_in_douban : tried_in_douban,
        status          : 0
    }).orderBy({'id' : 'desc'}).limit(1, num).all();
    // @todo:分页
    if ( !book_list || (0 == book_list[0].num )) {
        return false;
    }
    return book_list;
}

/**
 * 更新书籍信息
 * @param  {object}   updateObj     要更新的内容
 * @param  {object}   whereObj      where条件
 * @yield  {bool}   是否成功
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-04-26
 */
exports.updateBookInfo = function * ( updateObj, whereObj ) {
    "use strict"
    let succ  = yield tbl_drawing.update(updateObj, whereObj);
    return succ;
}