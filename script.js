$(document).ready(function() {
    var currentColor = "red";
    var colClass;
    var rowClass;
    var board;
    var animationComplete = true;
    var gameOver;
    var blinker;
    initialiseBoard();

    function initialiseBoard() {
        gameOver = false;
        board = [];
        colClass = "";
        rowClass = "";
        for (var i = 0; i < 7; i++) {
            board[i]=[];
        }
        indicateTurn();
    }

    function indicateTurn() {
        $("#turn-indicator p").html(currentColor.toUpperCase() + "'S TURN").css({color: currentColor});
    }

    $(".col").on("click", function() {//listen for clicks on a column
        if(animationComplete) {
            for (var i = 0; i < 7; i++) {
                var colClassLoop = "c" + i; //check class to see which column was clicked
                if ($(this).hasClass(colClassLoop)) {
                    animationComplete = false; //do not respond to further clicks until animation completes
                    board[i].push(currentColor); //add the chip/color to the array
                    rowClass = ".r" + (board[i].length - 1).toString(); //target the row (using the row class) to color after animation finished
                    colClass = colClassLoop; //target the column (using the column class) that contatins the row to be colored after animation
                    $("#moving-chip").css({transition: "top 1s", transform: "translateX(" + i * 100 + "px)", visibility: "visible", "background-color": currentColor, top: 600 - 100 * board[i].length + "px"}); //reposition and drop chip
                }
            }
        }
    });

    function checkForWinner() {//game logic
        for (var x = 0; x < board.length; x++) {
            for (var y = 0; y < board[x].length; y++) {
                if (!gameOver && x + 3 < board.length && board[x][y] == currentColor && board[x+1][y] == currentColor && board[x+2][y] == currentColor && board[x+3][y] == currentColor) { //check horizontal
                    for (var i = x; i < board.length; i++) {
                        if (board[i][y] == currentColor){
                            $(".c" + i + " .r" + y).addClass("blink-me");
                        }
                    }
                    displayModal();
                } else if (!gameOver && y + 3 < board[x].length && board[x][y] == currentColor && board[x][y+1] == currentColor && board[x][y+2] == currentColor && board[x][y+3] == currentColor) {//check vertical
                    for (var j = y; j < board[x].length; j++) {
                        if (board[x][j] == currentColor){
                            $(".c" + x + " .r" + j).addClass("blink-me");
                        }
                    }
                    displayModal();
                } else if (!gameOver && x + 3 < board.length && y + 3 < board[x + 3].length && board[x][y] == currentColor && board[x+1][y+1] == currentColor && board[x+2][y+2] == currentColor && board[x+3][y+3] == currentColor) {//check diagonal up
                    for (i = x, j = y; i < board.length && j < board[i].length; i++, j++) {
                        if (board[i][j] == currentColor){
                            $(".c" + i + " .r" + j).addClass("blink-me");
                        }
                    }
                    displayModal();
                } else if (!gameOver && x + 3 < board.length && y - 3 >= 0 && board[x][y] == currentColor && board[x+1][y-1] == currentColor && board[x+2][y-2] == currentColor && board[x+3][y-3] == currentColor) {//check diagonal down
                    for (i = x, j = y; i < board.length && j < board[i].length; i++, j--) {
                        if (board[i][j] == currentColor){
                            $(".c" + i + " .r" + j).addClass("blink-me");
                        }
                    }
                    displayModal();
                }
            }
        }
    }

    function displayModal() { //display modal on game over
        gameOver = true;
        $(".modal-content p, #turn-indicator p").html(currentColor.toUpperCase() + " WINS!!!").css({color: currentColor});
        $(".modal").css({display: "inline"});
        blink();
    }

    function blink() { //blink winning chip sequence
        blinker = setInterval(function() {
            $(".blink-me").fadeOut(100).fadeIn(100);
        }, 250);
    }

    $("#moving-chip").on("transitionend", function() { //check for winner once chip falling animation is complete, otherwise indicate next turn
        $("#moving-chip").css({visibility: "hidden", transition: "0s", top: "-87px"});
        $("." + colClass + " " + rowClass).addClass(currentColor);
        animationComplete = true;
        checkForWinner();
        if (currentColor == "red" && !gameOver) {
            currentColor = "yellow";
            indicateTurn();
        } else if (currentColor && !gameOver) {
            currentColor = "red";
            indicateTurn();
        }
    });

    $(".modal-close").on("click", function fn() { //restart game when winner modal closed
        clearInterval(blinker);
        $(".modal").css({display: "none"});
        $(".row").removeClass("red yellow blink-me");
        currentColor = "red";
        initialiseBoard();
    });
});
