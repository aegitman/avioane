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

    takeFire(x, y) {}
}

export default Board