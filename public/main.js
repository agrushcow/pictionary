var pictionary = function() {
    var socket = io();
    var canvas, context;
    var drawing = false;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };

    // setup canvas and context
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function(event) {
        if (!drawing) {return;}
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left, y: event.pageY - offset.top};
        draw(position);
        socket.emit('draw', position);
    });

    canvas.on('mousedown', function() {
        drawing = true;
    });

    canvas.on('mouseup', function(){
        drawing = false;
    });

    var guessBox = $('#guess input');
    var guesses = $('#guesses');

    var addGuess = function(guess) {
      guesses.text(guess);
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        } else {
        socket.emit('guess', guessBox.val());
        guessBox.val('');
      }
    };
    guessBox.on('keydown', onKeyDown);

    //Assign roles
    var rolesBlock = $('#roles');

    var assignDraw = function() {
      rolesBlock.text("Drawer");
      console.log("draw");
    };

    var assignGuess = function() {
      rolesBlock.text("Guesser");
    };

    socket.on('draw', draw);
    socket.on('guess', addGuess);
    socket.on('drawer', assignDraw);
    socket.on('guesser', assignGuess);
};

$(document).ready(function() {
    pictionary();
});
