var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var connectionCount = 0;
var word;
var socketArr = [];

io.on('connection', function (socket) {
    console.log('Client connected');
    connectionCount++;
    socketArr.push(socket);
    if (connectionCount == 1) {
      socket.role = 'drawer';
      socket.emit("drawer");
    } else {
      socket.role = 'guesser';
      socket.emit('guesser');
    }

    socket.on('disconnect', function() {
        console.log('A user has disconnected');
        connectionCount--;
        var i = socketArr.findIndex(function(element, index, array) {
          return element.id = socket.id;
        });
        socketArr.splice(i,1);
        if(socket.role == 'drawer') {
          if(connectionCount > 1) {
            socketArr.forEach(function(element, index, array){
              if(index == 0) {
                element.role = 'drawer';
                element.emit('drawer');
              } else {
                element.role = 'guesser';
                element.emit('guesser');
              }
            });
          } else {
            socketArr[0].role = 'drawer';
            socketArr[0].emit('drawer');
          }
        }
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
