var mysql = require('@sina/koa-mysql');
var init  = require('lib/sysInit');

module.exports = function(tableName, tableId) {
    'use strict';
    let _config = init.config.DATABASE;
    let mysqlObj = new mysql(_config, tableName, tableId);
    return mysqlObj;
};
