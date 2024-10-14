import Board from './board.js';
import Plane from './plane.js';
import Ai from './ai.js';

var setupGameBtn = document.querySelector('#setupGame');
var startGameBtn = document.querySelector('#startGame');
var msgLbl = document.querySelector('#message');
var userBoardDiv = document.querySelector('.userBoard');
var aiBoardDiv = document.querySelector('.aiBoard');

var planesLeft = 3;
var activePlane = null;
var userBoard = new Board();
var aiBoard = new Board();
var ai = new Ai();

var pressTimer;
var isJustRemoved = false;


function paintPlaneAt(x, y) {
    // if the plane is already there, remove it
    activePlane = userBoard.isCellInPlane(x, y)
    if( activePlane != null) {
        // remove old plane    
        userBoard.removePlane(activePlane);
        removeUIPlane(activePlane)
    } else {
        // create initial new plane
        activePlane = new Plane(x, y, 'N');        
    }

    // check if the plane is not coliding with other planes
    activePlane = userBoard.findNextValidPlane(activePlane);
    
    if(activePlane != null) {
        userBoard.addPlane(activePlane);
        placePlane();
     
        // paint new plane
        for (let cell of activePlane.getBody()) {
            let col = getCellAt(cell.x, cell.y);
            col.classList.add('cell-p');
        }    
    }
}

function getCellAt(x, y) {
    let row = document.querySelector('div[data-row="' + x + '"]');
    let col = row.querySelector('div[data-col="' + y + '"]');
    return col;
}

function getAICellAt(x, y) {
    let row = document.querySelector('div.aiBoard div[data-row="' + x + '"]');
    let col = row.querySelector('div[data-col="' + y + '"]');
    return col;
}


function removeUIPlane(plane) {  
    for (let cell of plane.getBody()) {
        let col = getCellAt(cell.x, cell.y);
        col.classList.remove('cell-p');
    }
}

function pointsAreCorners(x, y) {
    return (x == 0 && y == 0) || 
    (x == 0 && y == 9) || 
    (x == 9 && y == 0) || 
    (x == 9 && y == 9);
}

function placePlane() {
    planesLeft = 3 - userBoard.planesCount();
    // document.querySelector('#userPlanesLeft').innerHTML = planesLeft;    
    if(planesLeft > 1) {
        document.querySelector('#message').innerHTML = "Place your " + planesLeft + " planes";
    } else {
        if (planesLeft == 1) {
            document.querySelector('#message').innerHTML = "Place your last plane";
        } else {
            document.querySelector('#message').innerHTML = "You are ready to go !";
        }
    } 

    if(planesLeft == 0) {
        startGameBtn.style.display = "block";  
        startGameBtn.disabled = false;          
    } else {
        startGameBtn.style.display = "none";
    }
}

/**
 * Handles user click on a cell in the board, 
 * painting the plane at that position or rotating it if it was already there.
 * @param {Event} e - the click event
 */
function placePlaneAction(e) {
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');
    if(isJustRemoved) { // cancel further placement
        isJustRemoved = false;
        return;
    }
    if(pointsAreCorners(x, y)) {
        return;
    }
    // no new planes
    if(planesLeft == 0 && !userBoard.isCellInPlane(x, y)) {
        return;
    }
    paintPlaneAt(x, y);
}

function removePlane(e) {
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');
    let p = userBoard.isCellInPlane(x, y);
    if(p != null) {
        userBoard.removePlane(p);
        removeUIPlane(p);
        placePlane();
    }
    isJustRemoved = true;
}

function setupGame() {
    resetEnvironment();
    
    // prepare the UI for interaction
    msgLbl.style.display = "block";
    userBoardDiv.style.display = "flex";
    // setupGameBtn.disabled = true;

    // allow clicks on the board to place the planes
    var cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener('click', placePlaneAction, false);

        cell.addEventListener('mousedown', function(e){
            // Set timeout
            pressTimer = window.setTimeout(function(){removePlane(e)},1000)
            return false; 
          }, false);

        cell.addEventListener('mouseup', function(){
            clearTimeout(pressTimer)
            // Clear timeout
            return false;
        }, false);
    }

    userBoard.generateRandomPlanes();
    placePlane();
     
    for(let p of userBoard.getAllPlanes()) {
        for (let cell of p.getBody()) {
            let col = getCellAt(cell.x, cell.y);
            col.classList.add('cell-p');
        }  
    }
}

function removeUserBoardEvents() {
    var cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.replaceWith(cell.cloneNode(true));
    }
}

function userHitsOnAi(e) {
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');

    let cellsHit = aiBoard.takeFire(x, y);
    if(cellsHit.length > 0) {
        for(let c of cellsHit) {
            let col = getAICellAt(c.x, c.y);
            col.classList.add('cell-hit');
        }
    } else {
        e.target.classList.add('cell-miss');        
    }   

    // todo - check if user wins
    if(isGameOver('user')) {
        return;
    }

    aiHitsUser();
}

function aiHitsUser() {
    let aiHit = ai.takeAShot();
    let x = aiHit.x;
    let y = aiHit.y;

    console.log('AI hits on user at ' + x + ',' + y);
    let cellsHit = userBoard.takeFire(x,y);
    if(cellsHit.length > 0) {
        if(cellsHit.length == 1) {
            ai.setFeedback(x, y, true);
        } else {
            ai.setPlaneKill(cellsHit);
        }
        for (let c of cellsHit) {               
            let col = getCellAt(c.x, c.y);
            col.classList.add('cell-hit');            
        }
    } else {
        ai.setFeedback(x, y, false);
        let col = getCellAt(x, y);
        col.classList.add('cell-miss');
    }
    if(isGameOver('ai')) {
        return;
    }
}
function startGame() {
    console.log('Start game');    
    removeUserBoardEvents();
    startGameBtn.disabled = true;
    aiBoard.generateRandomPlanes();
    aiBoardDiv.style.display = "flex";

    var cells = document.querySelector("div.aiBoard").getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener('click', userHitsOnAi, false);
    }
}

function isGameOver(who) {
    let isOver = false;
    if(who == 'user' && aiBoard.isGameOver()) {
        isOver = true;
        //  update User score
        let oldScore = parseInt(document.getElementById('userScore').innerHTML);
        document.getElementById('userScore').innerHTML = oldScore + 1;
        document.querySelector('#message').innerHTML = "You won !";
    } else if(who == 'ai' && userBoard.isGameOver()) {
        isOver = true;
        //  update AI score
        let oldScore = parseInt(document.getElementById('aiScore').innerHTML);
        document.getElementById('aiScore').innerHTML = oldScore + 1;
        document.querySelector('#message').innerHTML = "You lost !";
    }

    if(isOver) {
        endGame();
    }
    return isOver;
}

function endGame() {
    console.log('End game');
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        // cell.classList.remove('cell-hit', 'cell-miss', 'cell-p');
        cell.replaceWith(cell.cloneNode(true));
    }
    setupGameBtn.disabled = false;    
}

function resetEnvironment(){
    console.log('Reset environment');
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.classList.remove('cell-hit', 'cell-miss', 'cell-p');
    }
    aiBoardDiv.style.display = "none";
    setupGameBtn.disabled = false;
    startGameBtn.disabled = true;
    aiBoard.reset();
    userBoard.reset();
    ai = new Ai();

    placePlane();
}

// Link actions to buttons

setupGameBtn.addEventListener('click', setupGame)
startGameBtn.addEventListener('click', startGame)