class Ai {
    #directions = ['N', 'S', 'E', 'V'];
    #dimension = 10;
    #hits = [];
    #emptyCells = [];  
    #map;  
    
    constructor() { 
        this.#map = Array(this.#dimension)
                    .fill()
                    .map(() => Array(this.#dimension).fill(0));
    }

    #resetMap() {
        this.#map = Array(this.#dimension)
                    .fill()
                    .map(() => Array(this.#dimension).fill(0));
    }

    #findPlaneFor(x, y) {
        return new Map([
          ['N', [{ x: x, y: y }, { x: x + 1, y: y }, { x: x + 2, y: y }, { x: x + 3, y: y }, { x: x + 1, y: y - 1 }, { x: x + 1, y: y + 1 }, { x: x + 3, y: y - 1 }, { x: x + 3, y: y + 1 }]],
          ['S', [{ x: x, y: y }, { x: x - 1, y: y }, { x: x - 2, y: y }, { x: x - 3, y: y }, { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }, { x: x - 3, y: y + 1 }, { x: x - 3, y: y - 1 }]],
          ['E', [{ x: x, y: y }, { x: x, y: y + 1 }, { x: x, y: y + 2 }, { x: x, y: y + 3 }, { x: x - 1, y: y + 1 }, { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 3 }, { x: x + 1, y: y + 3 }]],
          ['V', [{ x: x, y: y }, { x: x, y: y - 1 }, { x: x, y: y - 2 }, { x: x, y: y - 3 }, { x: x + 1, y: y - 1 }, { x: x - 1, y: y - 1 }, { x: x + 1, y: y - 3 }, { x: x - 1, y: y - 3 }]],
        ]);
      }

    /**
     * Given a list of points, return true if is outside the board
     * @param {*} v 
     * @returns 
     */
    #isOutside(v) {
        for (let i = 0; i < v.length; i++) {
          if (v[i].x < 0 || v[i].y < 0 || v[i].x > 9 || v[i].y > 9) {
            return true;
          }
        }
        return false;
    }

    /**
     * Given a list of points, return true if is part of an empty cell
     * @param {*} v 
     * @returns 
     */
    #isPartOfEmpty(v) {
        for (let i = 0; i < v.length; i++) {
            for(let j = 0; j < this.#emptyCells.length; j++) {
                if(v[i].x == this.#emptyCells[j].x && v[i].y == this.#emptyCells[j].y) {
                    return true;
                }
            }                 
        }
        return false;
    }

    #isPartOfHit(v) {
        let isOnHit = 0;
        for (let i = 0; i < v.length; i++) {
            if(this.#isCellAHit(v[i].x, v[i].y)) {
                isOnHit++;
            }            
        }
        return isOnHit;
    }

    #isCellAHit(x, y) {
        for(let i = 0; i < this.#hits.length; i++) {
            if(this.#hits[i].x == x && this.#hits[i].y == y) {
                return true;
            }
        }
        return false;
    }

    #findTheOptimalShot(planes, maxHit) {
      for (let i = 0; i < planes.length; i++) { // mark the most effective shots
        if(planes[i].h == maxHit) {
          let x = planes[i].x;
          let y = planes[i].y;
          if (!this.#isCellAHit(x, y)) {
              this.#map[x][y] = this.#map[x][y] + 1; // increase the probability         
          }
        }
      }


      let max = 0;
      let bestShots = [];
      // find the maximum value
      for (let mi = 0; mi < this.#dimension; mi++) {
        for (let mj = 0; mj < this.#dimension; mj++) {
          if (max < this.#map[mi][mj]) {
            max = this.#map[mi][mj];
          }
        }
      }
      
      if(max == 0) { // no viable shot
        return this.#takeARandomShot()
      }
      
      // take all the best shots
      //
      for (let mi = 0; mi < this.#dimension; mi++) {
          for (let mj = 0; mj < this.#dimension; mj++) {
            if (max == this.#map[mi][mj]) {
              bestShots.push({x: mi, y: mj});
            }
          }
      }

      console.log('Best shots are ' + bestShots);

      return  bestShots[Math.floor(Math.random()*bestShots.length)];
    }

    setFeedback(x, y, wasHit) {
        if(wasHit) {
            this.#hits.push({x: x, y: y});
        } else {
            this.#emptyCells.push({x: x, y: y});
        }
    }

    setPlaneKill(v) {
        for (let i = 0; i < v.length; i++) {
            this.#emptyCells.push({x: v[i].x, y: v[i].y});
        }
    }

    // AI tries to guess the user's planes position
    takeAShot() {
        if(this.#hits.length == 0) {    
            return this.#takeARandomShot();
        }

        // reset the search map
        this.#resetMap();
        let gMaxHit = 0; // the most effective shot
        let gPlanes = []; // all planes
        
        //for all the points on the map 
        //
        for (let mi = 0; mi < this.#dimension; mi++) {
          for (let mj = 0; mj < this.#dimension; mj++) {
            
            // find planes in all directions
            let planes = this.#findPlaneFor(mi, mj);
      
            //for each direction find the most effective shot
            for (let d of this.#directions) {
              if (this.#isOutside(planes.get(d)) || this.#isPartOfEmpty(planes.get(d))) {
                continue; // skip the obvious invalid directions
              }
      
              let maxHit = this.#isPartOfHit(planes.get(d)); // count the maximum hits by this plane
              if (maxHit > gMaxHit) {
                gMaxHit = maxHit;
              } 
              if(maxHit > 0) { // if it hit anything, save it for performance evaluation
                gPlanes.push({x: mi, y: mj, h: maxHit});
              }
            }
          }
        }

        console.log('All Planes that hit something: ' + gPlanes);
        console.log('The plane that covers a maximum number of hits ' + gMaxHit);

        return this.#findTheOptimalShot(gPlanes, gMaxHit);
    }

    #takeARandomShot(){
      console.log('No hits found. Generating random shot...');
      let x, y;
      do {
        x = Math.floor(Math.random() * 6) + 2;
        y = Math.floor(Math.random() * 6) + 2;
        // random but not repeating
      } while(this.#isPartOfEmpty([{x: x, y: y}]) || this.#isCellAHit(x, y));

      return {x: x, y: y};
    }
}

export default Ai;