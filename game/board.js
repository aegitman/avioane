import Plane from "./plane.js";

class Board {

    #rows = 10;
    #planes = [];    

    constructor() {
    }

    addPlane(plane) {
        this.#planes.push(plane);
    }

    removePlane(plane) {
        this.#planes.splice(this.#planes.indexOf(plane), 1);
    }

    planesCount() {
        return this.#planes.length;
    }

    hasPlane(x, y) {
        for (let i = 0; i < this.#planes.length; i++) {
            if (this.#planes[i].x == x && this.#planes[i].y == y) {
                return true;
            }
        }
        return false;
    }

    getPlane(x, y) {
        for (let i = 0; i < this.#planes.length; i++) {
            if (this.#planes[i].x == x && this.#planes[i].y == y) {
                return this.#planes[i];
            }
        }
        return null;
    }

    getAllPlanes() {
        return this.#planes;
    }

    findNextValidPlane(activePlane, level = 1) {
        activePlane.nextDirection();
        let ap = new Plane(activePlane.x, activePlane.y, activePlane.h); // activePlane.getBody();
        if (level > 5) {
            return null;
        }
        if (this.isPlaneValid(ap)) {
            return ap;
        } else {
            return this.findNextValidPlane(ap, level + 1);
        }
    }

    isPlaneValid(plane) {
        let argPlanePoints = plane.getBody();
        for (let i = 0; i < this.#planes.length; i++) {
            let ownPlanePoints = this.#planes[i].getBody();
            for (let j = 0; j < ownPlanePoints.length; j++) {
                for(let k = 0; k < argPlanePoints.length; k++) {
                    if(ownPlanePoints[j].x == argPlanePoints[k].x && 
                        ownPlanePoints[j].y == argPlanePoints[k].y) {
                        return false;
                    }    
                }
            }
        }
        return true;
    }

    generateRandomPlanes() {
        while(this.planesCount() < 3) {
            let x = Math.floor(Math.random() * 8) + 1;
            let y = Math.floor(Math.random() * 8) + 1;
            let plane = new Plane(x, y, this.randomDirection());
            if (this.isPlaneValid(plane)) {
                this.addPlane(plane);
            }
        }
    }

    randomDirection() {
        let d = ['N', 'E', 'S', 'V'];
        return d[Math.floor(Math.random() * 4)];
    }

    takeFire(x, y) {
        let isHit = [];
        for (let i = 0; i < this.#planes.length; i++) {
            let ph = this.#planes[i].takeFire(x, y);
            if (ph.length > 0) {
                isHit.push(this.#planes[i].takeFire(x, y));   
            }
        }
        return isHit;
    }
}

export default Board