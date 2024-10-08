class Spot {
    #x;
    #y;
    #state;

    constructor(x, y, state) {
        this.#x = x;
        this.#y = y;
        this.#state = state;  // unknown -1, miss 0, hit 1, sunk 2
    }

    hit() {
        this.#state = 1;
    }

    isHit() {
        return this.#state == 1;
    }

    miss() {
        this.#state = 0;
    }

    isMiss() {
        return this.#state == 0;
    }

    sunk() {
        this.#state = 2;
    }

    isSunk() {
        return this.#state == 2;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
}

export { Spot };