class Plane{
    directions = ['N', 'S', 'E', 'V'];
    
    constructor(hitPoints) { 
        // give a list of points (x,y), can they form a plane ?
        // and if yes, where is the cabin ?
        this.hitPoints = hitPoints;
    }

    findMaxHitPoint() {
        // find clusters of points that can form a plane
        // 

        let heads = [];
        this.clearAllCells();
        for(let i = 0; i < this.hitPoints.length; i++) {
            heads = this.validateHeads(this.findHeadsFor(this.hitPoints[i].x, this.hitPoints[i].y));

            for(let j = 0; j < heads.length; j++) {
                this.valueCell(heads[j].x, heads[j].y);
            } 
        }
        
        return heads;
    }

    valueCell(x,y) {
        let cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            if(cells[i].parentElement.getAttribute('data-row') == x && 
                    cells[i].getAttribute('data-col') == y) {
                        
                let v = cells[i].innerHTML;
                if(v == '') {
                    cells[i].innerHTML = 1;
                } else {
                    cells[i].innerHTML = parseInt(v) + 1;
                }              
            }
        }
    }

    clearAllCells() {
        let cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerHTML = '';
        }
    }


    validateHeads(points) {
        let validPoints = [];
        for(let p of points) {
            if(p.x >= 0 && p.y >= 0 && p.x < 10 && p.y < 10) {
                
                validPoints.push(p);
            }
        }
        return validPoints;
    }

    validateNotOut(planes) {
        let planesNotOut = []
        for(let d of this.directions) {
            let isOut = false;
            let v = planes.get(d);
            for (let i = 0; i < 8; i++) {
                if (v[i].x < 0 || v[i].y < 0 || v[i].x > 9 || v[i].y > 9) {
                isOut = true;
                break;
                }
            }
            if(!isOut) {
                planesNotOut.push(v);
            }
        }
        return planesNotOut;
    }
    findPlaneFor(x, y) {
        return new Map([
          ['N', [{ x: x, y: y }, { x: x + 1, y: y }, { x: x + 2, y: y }, { x: x + 3, y: y }, { x: x + 1, y: y - 1 }, { x: x + 1, y: y + 1 }, { x: x + 3, y: y - 1 }, { x: x + 3, y: y + 1 }]],
          ['S', [{ x: x, y: y }, { x: x - 1, y: y }, { x: x - 2, y: y }, { x: x - 3, y: y }, { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }, { x: x - 3, y: y + 1 }, { x: x - 3, y: y - 1 }]],
          ['E', [{ x: x, y: y }, { x: x, y: y + 1 }, { x: x, y: y + 2 }, { x: x, y: y + 3 }, { x: x - 1, y: y + 1 }, { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 3 }, { x: x + 1, y: y + 3 }]],
          ['V', [{ x: x, y: y }, { x: x, y: y - 1 }, { x: x, y: y - 2 }, { x: x, y: y - 3 }, { x: x + 1, y: y - 1 }, { x: x - 1, y: y - 1 }, { x: x + 1, y: y - 3 }, { x: x - 1, y: y - 3 }]],
        ]);
      }

       findHeadsFor(x, y) {
        return [{x: x-3, y:y+1}, 
          {x: x-3, y:y},
          {x: x-3, y:y-1},
          {x: x-2, y:y},
          {x: x-1, y:y+1},
          {x: x-1, y:y},
          {x: x-1, y:y-1},
          {x: x+1, y:y+1},
          {x: x+1, y:y},
          {x: x+1, y:y-1},
          {x: x+2, y:y},
          {x: x+3, y:y},
          {x: x+3, y:y+1},
          {x: x+3, y:y-1},
          {x: x, y:y-1},
          {x: x, y:y-2},
          {x: x+1, y:y-3},
          {x: x, y:y-3},
          {x: x-3, y:y-3},
          {x: x, y:y+1},
          {x: x, y:y+2},
          {x: x+1, y:y+3},
          {x: x, y:y+3},
          {x: x-1, y:y+3}
        ];
      }
}

export { Plane };