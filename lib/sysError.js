'use strict'

var swig = require('swig');
var http = require('http');
var path = require('path');
var fs = require('fs');

module.exports = error;

function error(init) {
    return function *error(next) {
        try {
            yield next;
            if (404 == this.response.status && !this.response.body) this.throw(404);
        } catch (err) {
            this.status = err.status || 500;

            // application
            this.app.emit('error', err, this);

            // accepted types
            switch (this.accepts('html', 'text', 'json')) {
                case 'text':
                    if ('development' == process.env.NODE_ENV) this.body = err.message;
                    else if (err.expose) this.body = err.message; // expose 用户级别错误
                    else throw err;
                    break;

                case 'json':
                    if ('development' == process.env.NODE_ENV) this.body = { error: err.message };
                    else if (err.expose) this.body = { error: err.message };
                    else this.body = { error: http.STATUS_CODES[this.status] };
                    break;

                case 'html':
                    let _errorFile = path.join(init.config.STATIC_PATH, 'error.html');
                    let _cunstomFile = path.join(init.config.TEMPLATE_PATH, 'public/error.html');
                    if (fs.exists(_cunstomFile)) {
                        _errorFile = _cunstomFile;
                    }
                    var render = swig.compileFile(_errorFile);
                    this.body = render({
                        title: init.config.PROJECT_NAME,
                        env: process.env.NODE_ENV,
                        error: err.message,
                        stack: err.stack,
                        status: this.status,
                    });
                    break;
            }
        }
    };
}
