var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var connectionCount = 0;

io.on('connection', function (socket) {
    console.log('Client connected');
    connectionCount++;
    if (connectionCount == 1) {
      socket.role = 'drawer';
      socket.emit("drawer");
    } else {
      socket.role = 'guesser';
      socket.emit('guesser');
    }

    socket.on('draw', function(position) {
      socket.broadcast.emit('draw', position);
    });

    socket.on('guess', function(guess) {
      socket.broadcast.emit('guess', guess);
    });
});

server.listen(process.env.PORT || 8080);
