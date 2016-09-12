var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var connectionCount = 0;
io.on('connection', function (socket) {
    console.log('Client connected');
    connectionCount++;
    io.emit('total', connectionCount);

    socket.on('disconnect', function() {
      console.log('Client disconnected');
      connectionCount--;
      io.emit('total', connectionCount);
    });

    socket.on('username', function(username) {
      socket.username = username;
      console.log('Received username: ', username);
      socket.broadcast.emit('username', socket.username + " has signed in." );
    });

    socket.on('message', function(message) {
      console.log('Received message:', message);
      socket.broadcast.emit('message', socket.username + ": " + message);
    });

    socket.on('typing', function() {
      socket.broadcast.emit('typing', socket.username + ": is typing..." );
//i have the same structure here and it only shows up on the active port
    });
});

server.listen(process.env.PORT || 8080);
