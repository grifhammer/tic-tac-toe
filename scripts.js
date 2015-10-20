//******************************
// Tic Tac Toe - Scripts
//******************************

var activeClass = 'ttt-active';
var activeRegEx = /(?:^|\s)ttt-active(?!\S)/g;

// All possible wining combinations
var winners = [
    ['ttt_A1', 'ttt_A2', 'ttt_A3'],
    ['ttt_B1', 'ttt_B2', 'ttt_B3'],
    ['ttt_C1', 'ttt_C2', 'ttt_C3'],
    ['ttt_A1', 'ttt_B1', 'ttt_C1'],
    ['ttt_A2', 'ttt_B2', 'ttt_C2'],
    ['ttt_A3', 'ttt_B3', 'ttt_C3'],
    ['ttt_A1', 'ttt_B2', 'ttt_C3'],
    ['ttt_A3', 'ttt_B2', 'ttt_C1']
];

// Arrays of selected squares
var playSqrs = [];
var compSqrs = [];

// Variables for Computer's turn
var compOut   = 1500;
var compTimer = 0;
var compWait  = false;

// DOM Variables
var body    = document.getElementsByTagName('body')[0];
var message = document.getElementById('ttt_message');
var board   = document.getElementById('ttt_board');
var buttons = board.getElementsByTagName('button');

// Globals
var randButton = {};
var mark       = '';
var won        = false;


// GOODSQR()
// Finds a good square for the computer to select
function goodSqr(){
    var thisWin = [];
    var winCount = 0;
    var emptyCount = 0;
    var blockRow = -1;
    var winRow = -1;
    var emptyRow = -1;
    var blockCount = 0;
    for(var i = 0; i< winners.length; i++){
        thisWin = winners[i];
        blockCount = 0;
        winCount = 0;
        emptyCount = 0;
        for(var j = thisWin.length; j>=0; j--){
            if(compSqrs.indexOf(thisWin[j]) > -1){
                winCount++;
                blockCount++;
                emptyCount--;
            }else if(playSqrs.indexOf(thisWin[j]) > -1){
                blockCount--;
                winCount--;
                emptyCount--;
            } else {                                                // UNUSED IF CODE if(compSqrs.indexOf( thisWin[j] ) === -1 && playSqrs.indexOf(thisWin[j]) === -1 ) 
                emptyCount++;
            }
 
        }
        // console.log(winCount);
        // console.log(blockCount);
        // console.log(emptyCount);
        // if this win has only two computer spaces
        // place into the third space for the win
        if(winCount == 2){
            winRow = i;
            // i = winners.length;
        } else if ( blockCount == -2){
            blockRow = i;
        } else if (emptyCount === 3){
            emptyRow = i;
        }
        console.log("\n");
    }
    console.log("Winning row is: " + winRow);
    console.log("Blocking row is: " + blockRow);
    console.log("Empty row is: " + emptyRow);
    // randomSqr();
    var markThisButton;
    // if a row was found where the computer can win
    if(winRow > -1){
        i = 0;
        thisWin = winners[winRow];
        while(compSqrs.indexOf(thisWin[i]) !== -1 && i<3){
            i++;
        }
        markThisButton = document.getElementById(thisWin[i])
        markSqr(markThisButton, true);
    } else if(blockRow > -1){   //If a row was found where the computer needs to block
        i = 0;
        thisWin = winners[blockRow];
        while(playSqrs.indexOf(thisWin[i]) !== -1 && i<3){
            i++;
        }
        markThisButton = document.getElementById(thisWin[i]);
        markSqr(markThisButton, true);
    } else if(emptyRow > -1){
        markThisButton = document.getElementById(thisWin[0]);
        markSqr(markThisButton, true)
    } else{
        randomSqr();
    }
}

// CHECKWINS()
// Following selection ~
// Check to see if there are any winning row
function checkWins(sqrs, isPlayer) {
    var thisWin = [];
    var rowCount = 0;

    // Loop through possible winning combinations
    for (var i = 0; i < winners.length; i++) {
        thisWin = winners[i];
        rowCount = 0;
        // Loop through the IDs within the current combination
        for (var j = thisWin.length - 1; j >= 0; j--) {

            // Check for matches in current player's active squares
            if(sqrs.indexOf(thisWin[j]) > -1) {

                // Add '1' to the match count
                rowCount++;
            }
        };

        // if the match count === 3...
        if(rowCount === 3) {

            // Update 'won' variable to 'true'
            won = true;

            // Run 'gameOver'~
            // passing the winning combination and isPlayer
            gameOver(thisWin, isPlayer);

            // Stop the loop
            return;
        }
    };

    // If game hasn't been won...
    if(!won) {

        // Check for a draw
        checkDraw(isPlayer);
    }
};

// FINISHGAME()
// Set the board for the end of the game
function finishGame() {

    // Remove Click events from buttons
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].removeEventListener('click', btnBinding);
        buttons[i].blur();
    };

    // Add 'ttt_winner' class to board
    board.className += ' ttt_winner';

    // Remove active class from message
    message.className = message.className.replace(activeRegEx, '' );

    // Create 'Play Again' button
    var reloadBtn = document.createElement('button');
    reloadBtn.className = 'ttt_reloadBtn';
    reloadBtn.innerHTML = 'Play Again';

    // Bind reload to 'Play Again' button
    reloadBtn.addEventListener('click', function() {
        location.reload();
    });

    // Add 'Play Again' button to page
    body.appendChild(reloadBtn);
};

// CHECKDRAW()
// Following selection ~
// Check to see if the game is a draw
function checkDraw(isPlayer) {

    // Get all active squares ~
    // Concatenate both arrays
    var activeBtns = playSqrs.concat(compSqrs);

    // If all buttons are active...
    if(activeBtns.length >= buttons.length) {

        // Update message
        message.innerHTML = 'It\'s a Draw!';
        message.className += ' ttt_message-draw';

        // Set board for end of the game
        finishGame();
    } else {

        // Next player's turn
        isPlayer? compTurn(): playTurn();
    }
};

// GAMEOVER()
// Announce winner
function gameOver(winRow, isPlayer) {

    // Update message
    if(isPlayer) {
        board.className += ' ttt_winner-play';
        message.className += ' ttt_message-play';
        message.innerHTML = 'You won!';
    } else {
        board.className += ' ttt_winner-comp';
        message.className += ' ttt_message-comp';
        message.innerHTML = 'You lost.';
    }

    // Highlight the winning squares
    for (var j = 0; j < winRow.length; j++) {
        document.getElementById(winRow[j]).className += ' ttt_winSqr';
    };

    // Set board for end of the game
    finishGame();
};

// RANDOMSQR()
// Computer selects a random unselected square to mark
function randomSqr() {

    // Get random button between 1 and 9 (buttons.length)
    randButton = buttons[Math.floor((Math.random() * buttons.length) + 1) - 1];

    // If button is already active...
    if( randButton.className.match(activeRegEx) ) {

        // Run again...
        randomSqr();

    } else {

        // Mark the square
        markSqr(randButton, true);
    }
};

// COMPTURN()
// Computer's turn to play
function compTurn() {

    // Set variable to indicate computer is 'thinking'
    compWait = true;

    // Update board and message to indicate computer's turn
    board.className += ' ' + activeClass;
    message.innerHTML = 'My Turn...';
    message.className += ' ' + activeClass;

    // Set timer for computer's turn
    compTimer = setTimeout(function() {

        // Select a random square
        // randomSqr();
        goodSqr();

        // Reset 'thinking' variable
        compWait = false;

    }, compOut);

};

// PLAYTURN()
// Player's turn to play
function playTurn() {

    // Update message
    message.innerHTML = 'Your Turn...';

    // Remove active class from board and message
    board.className = board.className.replace(activeRegEx, '' );
    message.className = message.className.replace(activeRegEx, '' );
};

// MARKSQR()
// Mark a square as selected (with an 'X' or 'O')
function markSqr(button, comp) {

    // Set mark to 'X' or 'O'
    mark = comp? 'O': 'X';

    // Update text of button to 'X' or 'O'
    button.querySelector('.ttt_status').innerHTML = mark;

    // Make button active so it can no longer be selected
    button.className += ' ' + activeClass;

    // Add button to player's array and check for wins
    if(!comp) {
        playSqrs.push(button.id);
        checkWins(playSqrs, true);
    } else {
        compSqrs.push(button.id);
        checkWins(compSqrs, false);
    }
};

// BTNBINDING()
// Define actions for button clicks
function btnBinding(button) {

    // If computer's turn...
    if(compWait) {

        // Notify user to wait
        alert("Please, wait your turn.");

        // Stop event
        return;
    }

    // If button doesn't have active class...
    if( !this.className.match(activeRegEx) ) {

        // Mark the square
        markSqr(this);

    } else {

        // Inform the user the spot is already taken
        alert("Sorry, this spot is taken. Try another.");
    }
};

// Bind Events to all buttons (game squares)
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', btnBinding);
};

// Begin game with Player's turn
playTurn();
