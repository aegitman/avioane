import { Board } from "./board.js";

let board = new Board();

function doTheGrind() {
    console.log('Do the grind');
    board.update();
}

function clearBoard() {
    let elements = document.getElementsByClassName("cell");
    board.clearBoard();
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("hitCell");
      elements[i].classList.remove("nextHitCell");
      elements[i].classList.remove("emptyCell");
      elements[i].classList.remove("borderCell");
    }
  }
  
  function logClick(e) {
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');
    e.target.classList.add("hitCell");
    e.target.classList.remove("nextHitCell");
    e.target.classList.remove("emptyCell");
    board.markHit(x, y);
  }
  
  function logDblClick(e) {
    console.log('Double click');
    let x = e.target.parentElement.getAttribute('data-row');
    let y = e.target.getAttribute('data-col');
    e.target.classList.add("emptyCell");
    e.target.classList.remove("nextHitCell");
    e.target.classList.remove("hitCell");
    board.markMiss(x, y);
  }
  
  var elements = document.getElementsByClassName("cell");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', logClick, false);
    elements[i].addEventListener('dblclick', logDblClick, false);
  }

  document.querySelector('#clearBoard').addEventListener('click', clearBoard)
  document.querySelector('#findNextHit').addEventListener('click', doTheGrind)
  
  