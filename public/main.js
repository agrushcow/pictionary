$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var typing = $('#typing');
    var connections = $('#connections span');
    var clickCount = 0;

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
        typing.text("");
    };

    var updateConnections = function(connectionCount) {
      connections.html(connectionCount);
      console.log(connectionCount);
      //still only updates on refresh, have questions about actions onload/close
    };

    var addUsername = function(username) {
      messages.append(username);
    };

    var userType = function(msg) {
      typing.html('<div>' + msg + '</div>');
      //add timeout
    }

/*------------------  jQuery  ---------------------*/
    input.keypress(function(event) {
      if(event.keyCode == 13) {
        if(!socket.username) {
          //user is not signed in yet
          socket.emit('username', input.val());
          socket.username = input.val();
        } else {
          //user is signed in
          socket.emit('message', input.val());
          addMessage(socket.username + ": " + input.val());
        }
        input.val("");
        typing.text("");
      } else {
        if (socket.username) {
            socket.emit('typing');
        }
      }
    });

        // if(clickCount == 0) {
        //   if(event.keycode = 13) {
        //     addUsername(username);
        //     clickCount++;
        //   }
        // } else {
        //   if (event.keyCode != 13) {
        //       return;
        //   }
        //   var message = input.val();
        //
        //   if (socket.username) {
        //     addMessage(socket.username + ": " + message);
        //     socket.emit('message', message);
        //   } else {
        //     socket.emit('username', message);
        //     socket.username = message;
        //   }
        //   input.val('');
        // }

socket.on('message', addMessage);
socket.on('typing', userType);
socket.on('total', updateConnections);
socket.on('username', addUsername);
});
