import { Spot } from "./spot.js";
import { Plane } from "./plane.js";

class Board {

    constructor() {
        this.board = new Array(10);
        for (let i = 0; i < 10; i++) {
            this.board[i] = new Array(10);
        }

        for (let mi = 0; mi < 10; mi++) {
            for (let mj = 0; mj < 10; mj++) {
                this.board[mi][mj] = new Spot(mi, mj, -1);
            }
        }
    }

    clearBoard() {
        for (let mi = 0; mi < 10; mi++) {
            for (let mj = 0; mj < 10; mj++) {
                this.board[mi][mj] = new Spot(mi, mj, -1);
            }
        }
    }

    update(){
        let hits = [];
        for (let mi = 0; mi < 10; mi++) {
            for (let mj = 0; mj < 10; mj++) {
                if(this.board[mi][mj].isHit()){
                    hits.push(this.board[mi][mj]);
                }
            }
        }


        let plane = new Plane(hits);
         plane.findMaxHitPoint();
        
        
    }

    markHit(x, y) {
        this.board[x][y].hit();
        this.print();
    }
    markMiss(x, y) {
        this.board[x][y].miss();
        this.print();
    }

    print() {
        /// just for print
        for (let mi = 0; mi < 10; mi++) {
            console.log(this.board[mi]);
        }
    }
    
    borderCell(x,y) {
        let cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            if(cells[i].parentElement.getAttribute('data-row') == x && 
                    cells[i].getAttribute('data-col') == y) {
                        
                cells[i].classList.add("borderCell");
            }
        }
    }
}

export { Board };