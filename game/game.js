import Board from './board.js';
import Plane from './plane.js';
import Ai from './ai.js';

var setupGameBtn = document.querySelector('#setupGame');
var startGameBtn = document.querySelector('#startGame');
var endGameBtn = document.querySelector('#endGame');
var msgLbl = document.querySelector('#message');
var userBoardDiv = document.querySelector('.userBoard');
var aiBoardDiv = document.querySelector('.aiBoard');
var statusLbl = document.querySelector('#status');

var planesLeft = 3;
var activePlane = null;
var userBoard = new Board();
var aiBoard = new Board();
var ai = new Ai();

var pressTimer;
var isJustRemoved = false;


function paintPlaneAt(x, y) {
    console.log('Paint plane at ' + x + ',' + y);
    // if the plane is already there, remove it
    if( userBoard.hasPlane(x, y) ) {
        activePlane = userBoard.getPlane(x, y);
        // remove old plane    
        userBoard.removePlane(activePlane);
        removeUIPlane(activePlane)
    } else {
        // create initial new plane
        activePlane = new Plane(x, y, 'N');        
    }

    // check if the plane is not coliding with other planes
    activePlane = userBoard.findNextValidPlane(activePlane);
    console.log(activePlane);
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
    document.querySelector('#userPlanesLeft').innerHTML = planesLeft;

    if(planesLeft == 0) {
        startGameBtn.style.display = "block";    
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
    if(planesLeft == 0 && !userBoard.hasPlane(x, y)) {
        return;
    }
    paintPlaneAt(x, y);
}

function removePlane(e) {
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');
    console.log('Remove plane at ' + x + ',' + y);
    let p = userBoard.getPlane(x, y);
    if(p != null) {
        userBoard.removePlane(p);
        removeUIPlane(p);
        placePlane();
    }
    isJustRemoved = true;
}

function setupGame() {
    console.log('Setup game');
    // prepare the UI for interaction
    msgLbl.style.display = "block";
    userBoardDiv.style.display = "flex";
    setupGameBtn.disabled = true;

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

    console.log('User hits on AI at ' + x + ',' + y);
    let cellsHit = aiBoard.takeFire(x, y);
    if(cellsHit.length > 0) {
        for (let cell of cellsHit) {
            for(let c of cell) {
                let col = getAICellAt(c.x, c.y);
                col.classList.add('cell-hit');
            }
        }
    } else {
        e.target.classList.add('cell-miss');        
    }   

    // todo - check if user wins
    aiHitsUser();
}

function aiHitsUser() {
    let aiHit = ai.takeAShot();
    let x = aiHit.x;
    let y = aiHit.y;

    console.log('AI hits on user at ' + x + ',' + y);
    let cellsHit = userBoard.takeFire(x,y);
    if(cellsHit.length > 0) {
        for (let cell of cellsHit) {
            for(let c of cell) {
                ai.setFeedback(c.x, c.y, true);
                let col = getCellAt(c.x, c.y);
                col.classList.add('cell-hit');
            }
        }
    } else {
        ai.setFeedback(x, y, false);
        let col = getCellAt(x, y);
        col.classList.add('cell-miss');
    }
    // todo - check if AI wins
}
function startGame() {
    console.log('Start game');    
    removeUserBoardEvents();
    startGameBtn.disabled = true;
    statusLbl.style.display = "flex";

    aiBoard.generateRandomPlanes();

    aiBoard.getAllPlanes().forEach(p => {
        for (let cell of p.getBody()) {
            let col = getAICellAt(cell.x, cell.y);
            col.classList.add('cell-p');
        }  
    });

    aiBoardDiv.style.display = "flex";

    var cells = document.querySelector("div.aiBoard").getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener('click', userHitsOnAi, false);
    }
}

function endGame() {
    console.log('End game');
}

// Link actions to buttons

setupGameBtn.addEventListener('click', setupGame)
startGameBtn.addEventListener('click', startGame)
endGameBtn.addEventListener('click', endGame)
