'use strict';

let Memcached = require('co-memcached');
let init      = require('lib/sysInit');

let _config = init.config.MEMCACHED;
let memcached = new Memcached(_config.server, _config.options);

memcached.on('issue', (details) => {
    console.error('memcached服务[' + details.server + ']发生一个问题, ' + details.messages.join(''));
});

memcached.on('failure', (details) => {
    console.error('memcached服务[' + details.server + ']多次连接失败, ' + details.messages.join(''));
});

memcached.on('reconnecting', (details) => {
    console.error('memcached服务[' + details.server + ']重连中, ' + details.totalDownTime + 'ms');
});

memcached.on('reconnected', (details) => {
    console.error('memcached服务[' + details.server + ']重连成功, ' + details.messages.join(''));
});

memcached.on('remove', (details) => {
    console.error('memcached服务[' + details.server + ']当前不可用，即将移除, ' + details.messages.join(''));
});

module.exports = memcached;
