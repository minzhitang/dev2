var socket = require('socket.io');

var chat = {};
chat.io = false;
chat.userList = {};
chat.userNum = 0;

chat.initialize = function(server){
    this.io = socket(server);
    this.thatlisten();
}

chat.thatlisten = function(){
    var that = this;

    this.io.on('connection', function(socket) {
        // on connect
        console.log('somebody connected');

        that.addUser(socket);
        that.newMessage(socket);
        that.typing(socket);
        that.stopTyping(socket);
        that.disconnect(socket);
    });
}

chat.addUser = function(socket){
    var that = this;
    socket.on('add user', function(user) {
        console.log('add user: ' + user);

        // we store the user in the socket session for this client
        // add the client's user to the global list
        that.userList[socket.id] = user;
        ++that.userNum;
        console.log(that.userNum);
        console.log(that.userList);

        that.io.emit('login', {
            numUsers: that.userNum
        });

        that.io.emit('user joined', {
            username: that.userList[socket.id],
            numUsers: that.userNum
        });
    });
}

chat.newMessage = function(socket){
    var that = this;
    socket.on('new message', function(message) {
        that.io.emit('new message', {
            username: that.userList[socket.id],
            message: message
        });
    });
}

chat.typing = function(socket){
    var that = this;
    socket.on('typing', function() {
        console.log('%s is typing', that.userList[socket.id]);
        that.io.emit('typing', {
            username: that.userList[socket.id]
        });
    });
}

chat.stopTyping = function(socket){
    var that = this;
    socket.on('stop typing', function() {
        console.log('%s is stop typing', that.userList[socket.id]);
        that.io.emit('stop typing', {
            username: that.userList[socket.id]
        });
    });
}

chat.disconnect = function(socket){
    var that = this;
    socket.on('disconnect', function() {
        user = that.userList[socket.id];
        delete that.userList[socket.id];
        --that.userNum;

        that.io.emit('user left', {
            username: user,
            numUsers: that.userNum
        });
    });
}

module.exports = chat;