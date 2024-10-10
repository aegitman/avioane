class Plane {

    #directions = ['N', 'V', 'S', 'E'];

    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.h = h;
    }

    getBody() {
        let search = 0;
        do {
            let body = this.h == 'N' ? Plane.getN(this.x, this.y) : (this.h == 'S' ? Plane.getS(this.x, this.y) : (this.h == 'E' ? Plane.getE(this.x, this.y) : Plane.getV(this.x, this.y)));
            if(this.isValidBody(body)){
                return body;
            } else {
                this.nextDirection();
            }
            search++;
        } while (search < 5);
        return [];
    }

    isValidBody(body) {
        for (let i = 0; i < body.length; i++) {
            if (body[i].x < 0 || body[i].y < 0 || body[i].x > 9 || body[i].y > 9) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return a list of points that were hit, at least one if is not the head, all of them if is the head or null if is a miss
     * @param {*} x 
     * @param {*} y 
     * @returns - list of points that were hit, or null otherwise
     * 
     */
    takeFire(x, y) {
        if(this.x == x && this.y == y){
            return this.getBody();
        }
        for (let i = 0; i < this.getBody().length; i++) {
            if (this.getBody()[i].x == x && this.getBody()[i].y == y) {
                return [{x:x, y:y}];
            }
        }
        return [];
    }

    nextDirection() {
        let dir = this.h;
        this.h = this.#directions[(this.#directions.indexOf(dir) + 1) % 4];
    }

    // continue
    static getN(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        return [{ x: x, y: y }, { x: x + 1, y: y }, { x: x + 2, y: y }, { x: x + 3, y: y }, { x: x + 1, y: y - 1 }, { x: x + 1, y: y + 1 }, { x: x + 3, y: y - 1 }, { x: x + 3, y: y + 1 }];
    }

    static getS(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        return [{ x: x, y: y }, { x: x - 1, y: y }, { x: x - 2, y: y }, { x: x - 3, y: y }, { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }, { x: x - 3, y: y + 1 }, { x: x - 3, y: y - 1 }];
    }

    static getE(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        return [{ x: x, y: y }, { x: x, y: y + 1 }, { x: x, y: y + 2 }, { x: x, y: y + 3 }, { x: x - 1, y: y + 1 }, { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 3 }, { x: x + 1, y: y + 3 }];
    }

    static getV(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        return [{ x: x, y: y }, { x: x, y: y - 1 }, { x: x, y: y - 2 }, { x: x, y: y - 3 }, { x: x + 1, y: y - 1 }, { x: x - 1, y: y - 1 }, { x: x + 1, y: y - 3 }, { x: x - 1, y: y - 3 }];
    }
}

export default Plane