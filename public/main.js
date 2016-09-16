var wordsArr = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

var addWords = function() {
  var wordsLength = wordsArr.length;
  var wordsBlock = $('#words');
  for(var i = 0; i < wordsLength; i++) {
    wordsBlock.append(wordsArr[i] + " ");
  }
}

var pictionary = function() {
    var socket = io();
    var canvas, context;
    var drawing = false;
    var guessSpan = $('#guess span');

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
        if (!drawing || socket.role == 'guesser') {
          return;
        }
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
          if(socket.role == 'guesser') {
            socket.emit('guess', guessBox.val());
          } else { //drawer
            var guessVal = guessBox.val();
            if(wordsArr.indexOf(guessVal) > -1) {
              socket.emit('selection', guessVal);
              $('#words').html(guessVal);
            } else {
              alert("Be sure to select a matching word from the list");
            }
          }
        guessBox.val('');
      }
    };
    guessBox.on('keydown', onKeyDown);

    //Assign roles
    var rolesBlock = $('#roles');

    var assignDraw = function() {
      rolesBlock.text("Drawer");
      socket.role = "drawer";
      guessSpan.html('Please select a word from the list: ');
    };

    var assignGuess = function() {
      rolesBlock.text("Guesser");
      socket.role = "guesser";
      guessSpan.html('Make a guess:');
    };

    socket.on('draw', draw);
    socket.on('guess', addGuess);
    socket.on('drawer', assignDraw);
    socket.on('guesser', assignGuess);
};

$(document).ready(function() {
    pictionary();
    addWords();
});
