var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var connectionCount = 0;
var word;

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

    socket.on('disconnect', function() {
        connectionCount--;
        console.log('A user has disconnected');
    });

    socket.on('draw', function(position) {
      socket.broadcast.emit('draw', position);
    });

    socket.on('guess', function(guess) {
      if (guess == word) {
        socket.role = 'drawer';
        socket.emit('drawer');
        socket.broadcast.emit('guesser');
      } else {
        socket.broadcast.emit('guess', guess);
      }
    });

    socket.on('selection', function(selection) {
      word = selection;
    });
});

server.listen(process.env.PORT || 8080);
