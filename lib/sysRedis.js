'use strict';

let init = require('lib/sysInit');
let redisModule = require('redis');
let coRedis = require('co-redis');

module.exports = function(master_or_slave, db) {
    master_or_slave = master_or_slave || 'master';
    db = db || null;

    let _config = init.config.REDIS[master_or_slave];
    console.log('aaaaa');
    console.log(_config);
    console.log('aaaaa');
    let redisClient = redisModule.createClient(_config.port, _config.host, _config.options);

    if (db) {
        redisClient.select(Number.parseInt(db));
    };

    // redisClient.on("ready", function (err) {
    //     if (err) {
    //         console.error("Redis Error " + err);
    //     }else{
    //         console.info("Redis connection is established.");
    //     }
    // });

    redisClient.on('connect', (err) => {
        console.info('Redis connected.');
    });

    redisClient.on('reconnecting', function(err) {
        if (err) {
            console.error('Redis reconnecting Error ==> [delay: ' + err.delay + ', attempt: ' + err.attempt + ']');
        } else {
            console.info('Redis server losing the connection, trying to reconnect!');
        }
    });

    redisClient.on('error', (err) => {
        console.error(err.message);
    });

    redisClient.on('end', (err) => {
        console.error('Redis server connection has closed!');
    });

    return coRedis(redisClient);
};
