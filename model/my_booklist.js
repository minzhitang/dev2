var dialog_model = require('./dialog');
var book = require('./book');
var book_list = require('./book_list');
var common = require('@sina/koa-common');

/**
 * 我的书单的会话处理
 * @param  {Object}   dialog        会话
 * @param  {String}   content       用户输入
 * @param  {String}   msgtype       输入类型
 * @yield  {Object}   返回给用户的消息obj
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-04-13
 */
exports.process = function * ( dialog, content, msgtype ) {
    "use strict"
    // console.log(dialog);
    let stru = dialog.structure;
    stru.open_id = dialog.open_id;
    // console.log(stru);
    let step = stru.step;
    // console.log('++++++++++');
    // 每个result都有echo和step吐回来，step存起来即可，echo继续吐给message
    let result = {};
    // console.dir(stru.list);
    let handleFunc = stru.list[step].handle;

    // console.log(handleFunc);
    result = yield eval(handleFunc)( stru, content, msgtype );
    // console.log(result);

    for (let attr in result) {
        if ('echo' !== attr) {
            // 包括step, tmp_book_list, book_id等
            dialog.structure[attr] = result[attr];
        }
    }

    // console.log(dialog);

    // 结束
    if (1 == result.step) {
        dialog.status = 2;
    }
    // console.log(dialog);
    let succ = yield dialog_model.updateDialog( dialog );
    return result.echo;
}

/**
 * 初始化状态机结构体
 * @yield  {Object}   完成消息会话所需要的状态机
 *
 * @author minzhi <tang626@gmail.com>
 * @date   2016-02-14
 */
exports.init_structure = function * () {
    "use strict"
    return {
        'step'    : 0,
        'open_id' : '',
        'list'    : [
            {
                'comment' : '我的书单',
                'handle'  : 'showMyBookList',
            }
        ]
    };
}

var showMyBookList = function * ( stru, content, msgtype ) {
    "use strict"
    console.log(stru);
    let book_lists = yield book_list.getListByOpenId(stru.open_id);    
    // console.log(book_list);
    let result = {};
    if ( !book_lists || (0 == book_lists.length) ) {
        result = {
            'echo' : {
                'MsgType' : 'text',
                'Content' : '您还没有创建过书单哪，点创建书单按钮试一试？'
            },
            'step' : 1
        };
    }
    // @TODO: 书单特别多的情况，之后再处理。
    else {
        let items = [];
        // let tmp_book_list = [];
        // let pos = 1;
        for ( let list of book_lists ) {
            let book_arr = JSON.parse(list.content);
            let book_item = yield book.getBook(book_arr[0].book_id);
            if (book_item && book_item.picture) {
                let item = {
                    'Title'       : list.title,
                    'PicUrl'      : book_item.picture,
                    'Url'         : 'http://test.tingxiaozhu.cn/booklist/' + list.id,
                }
                items.push(item);
            }
            // tmp_book_list.push(list.id);
            // pos++;
        }

        result = {
            'echo' : {
                'MsgType'      : 'news',
                'ArticleCount' : items.length,
                'Articles'     : {
                    'item' : items
                }
            },
            'step' : 1,
        };
    }
    
    return result;
}