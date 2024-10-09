const directions = ['N', 'S', 'E', 'V'];
const dimension = 10;
let m = Array(dimension)
  .fill()
  .map(() => Array(dimension).fill(0));

// dinamic input, 
let hits = [];
let emptyCells = [];

function findPlaneFor(x, y) {
  return new Map([
    ['N', [{ x: x, y: y }, { x: x + 1, y: y }, { x: x + 2, y: y }, { x: x + 3, y: y }, { x: x + 1, y: y - 1 }, { x: x + 1, y: y + 1 }, { x: x + 3, y: y - 1 }, { x: x + 3, y: y + 1 }]],
    ['S', [{ x: x, y: y }, { x: x - 1, y: y }, { x: x - 2, y: y }, { x: x - 3, y: y }, { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }, { x: x - 3, y: y + 1 }, { x: x - 3, y: y - 1 }]],
    ['E', [{ x: x, y: y }, { x: x, y: y + 1 }, { x: x, y: y + 2 }, { x: x, y: y + 3 }, { x: x - 1, y: y + 1 }, { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 3 }, { x: x + 1, y: y + 3 }]],
    ['V', [{ x: x, y: y }, { x: x, y: y - 1 }, { x: x, y: y - 2 }, { x: x, y: y - 3 }, { x: x + 1, y: y - 1 }, { x: x - 1, y: y - 1 }, { x: x + 1, y: y - 3 }, { x: x - 1, y: y - 3 }]],
  ]);
}

function isOutside(v) {
  let isOut = false;
  for (let i = 0; i < 8; i++) {
    if (v[i].x < 0 || v[i].y < 0 || v[i].x > 9 || v[i].y > 9) {
      isOut = true;
      break;
    }
  }
  return isOut;
}

function isPartOfHit(v) {
  let isOnHit = 0;
  for (let i = 0; i < 8; i++) {
    if (m[v[i].x][v[i].y] == 'x') {
      isOnHit++;
    }
  }
  return isOnHit;
}

function isPartOfEmpty(v) {
  let isOnEmpty = false;
  for (let i = 0; i < 8; i++) {
    if (m[v[i].x][v[i].y] == 'o') {
      isOnEmpty = true;
      break;
    }
  }
  return isOnEmpty;
}

function findMaximAndPrint() {
  let max = 0;
  let x = 0;
  let y = 0;
  for (let mi = 0; mi < 9; mi++) {
    for (let mj = 0; mj < 9; mj++) {
      if (max < m[mi][mj]) {
        max = m[mi][mj];
        x = mi;
        y = mj;
      }
    }
  }
  console.log('Max is ' + max + ' at ' + x + ',' + y);
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("nextHitCell");
  }

  let rows = document.getElementsByClassName("row");
  for (var i = 0; i < rows.length; i++) {
    if( x == rows[i].getAttribute('data-row')) {
      let cells = rows[i].getElementsByClassName("cell");
      for (var j = 0; j < cells.length; j++) {
        if( y == cells[j].getAttribute('data-col')) {
          cells[j].classList.add("nextHitCell");
        }
      }
    }
  }
}

function doTheGrind() {
  // call this method
  wipeTheCells();
  let gMaxHit = 0;
  let gPlanes = [];
  for (let mi = 0; mi < 10; mi++) {
    for (let mj = 0; mj < 10; mj++) {
      // console.log('Work with cell ' + mi + ',' + mj);

      let planes = findPlaneFor(mi, mj);

      for (let d of directions) {
        // console.log('Work with direction ' + d);
        if (isOutside(planes.get(d)) || isPartOfEmpty(planes.get(d))) {
          // console.log('Direction ' + d + ' is outside');
          continue;
        }

        let maxHit = isPartOfHit(planes.get(d));  
        if (maxHit > gMaxHit) {
          gMaxHit = maxHit;
        } 
        if(maxHit > 0) {
          gPlanes.push({x: mi, y: mj, h: maxHit});
        }
      }
    }
  }

  for (let i = 0; i < gPlanes.length; i++) {
    if(gPlanes[i].h == gMaxHit) {
      let x = gPlanes[i].x;
      let y = gPlanes[i].y;
      if (m[x][y] != 'x') {
        valueIncrementOnCell(x, y);
        m[x][y] = m[x][y] + 1; // increase the probability         
      }
    }
  }
  print();
}

function print() {
  /// just for print
  for (let mi = 0; mi < 9; mi++) {
    console.log(m[mi]);
  }
}

function findNextHit() {
  for(let i=0;i<10;i++) {
    for(let j=0;j<10;j++) {
      m[i][j] = 0;
    }
  }
  for(let i=0;i<hits.length;i++) {
    m[hits[i].x][hits[i].y] = 'x';
  }
  for(let i=0;i<emptyCells.length;i++) {
    m[emptyCells[i].x][emptyCells[i].y] = 'o';
  }

  doTheGrind();

  findMaximAndPrint();
}

function addToHits(x, y) {
  let found = false;
  for(let i=0;i<hits.length;i++) {
    if(hits[i].x == x && hits[i].y == y) {
      found = true;
      break;
    }
  }
  if(!found)
    hits.push({x: x, y: y});
}

function removeFromHits(x, y) {
  for(let i=0;i<hits.length;i++) {
    if(hits[i].x == x && hits[i].y == y) {
      hits.splice(i, 1);
      break;
    }
  }
}

function clearBoard() {
  let elements = document.getElementsByClassName("cell");
  hits = [];
  emptyCells = [];
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("hitCell");
    elements[i].classList.remove("nextHitCell");
    elements[i].classList.remove("emptyCell");
  }
}

function logClick(e) {
  let x = e.target.parentElement.getAttribute('data-row');
  let y = e.target.getAttribute('data-col');
  e.target.classList.add("hitCell");
  e.target.classList.remove("nextHitCell");
  e.target.classList.remove("emptyCell");
  addToHits(x, y);
  console.log(hits);
}

function logDblClick(e) {
  console.log('Double click');
  let x = e.target.parentElement.getAttribute('data-row');
  let y = e.target.getAttribute('data-col');
  e.target.classList.add("emptyCell");
  e.target.classList.remove("nextHitCell");
  e.target.classList.remove("hitCell");
  removeFromHits(x, y);
  emptyCells.push({x: x, y: y});
}

var elements = document.getElementsByClassName("cell");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', logClick, false);
  elements[i].addEventListener('dblclick', logDblClick, false);
}

function valueIncrementOnCell(x, y) {
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].parentElement.getAttribute('data-row') == x && elements[i].getAttribute('data-col') == y) {
      let val = elements[i].innerHTML;
      if(val == '') {
        elements[i].innerHTML = 1;
      } else {
        elements[i].innerHTML = parseInt(val) + 1;
      }
    }
  }
}

function wipeTheCells(){
  let elements = document.getElementsByClassName("cell");
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = '';
  }
}