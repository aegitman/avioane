import  Board from './board.js';

var setupGameBtn = document.querySelector('#setupGame');
var startGameBtn = document.querySelector('#startGame');
var endGameBtn = document.querySelector('#endGame');
var msgLbl = document.querySelector('#message');
var userBoardDiv = document.querySelector('.userBoard');
var aiBoardDiv = document.querySelector('.aiBoard');

var activePlane = null;


function paintPlaneAt(x, y) {
    let cell = getCellAt(x, y);
    
    col.classList.add('cell-p-cp');

}

function getCellAt(x, y) {
    let row = document.querySelector('div[data-row="' + x + '"]');
    let col = row.querySelector('div[data-col="' + y + '"]');
    return col;
}

function placePlaneAction(e) {
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');
    console.log('Place plane action x ' + x + ' y ' + y);

    paintPlaneAt(x, y);
}


function setupGame() {
    console.log('Setup game');
    startGameBtn.style.display = "block";
    msgLbl.style.display = "block";
    userBoardDiv.style.display = "flex";
    setupGameBtn.disabled = true;

    var cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener('click', placePlaneAction, false);
  
    }
}

function startGame() {
    console.log('Start game');    
}

function endGame() {
    console.log('End game');
}


// Link actions to buttons

setupGameBtn.addEventListener('click', setupGame)
startGameBtn.addEventListener('click', startGame)
endGameBtn.addEventListener('click', endGame)
