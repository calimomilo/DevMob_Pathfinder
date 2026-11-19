import Matrix2D from "./Matrix2D.js";

export default class Automaton {
    constructor(
        rows, cols,
        birth = new Set(),
        survival = new Set()
    ) {
        this.birth = birth;
        this.survival = survival;
        this.matrix = new Matrix2D(rows, cols);
    }

    getMatrix() {
        return this.matrix;
    }

    randomize(prob) {
        for (let row = 0; row < this.matrix.rows; row++) {
            for (let col = 0; col < this.matrix.cols; col++) {
                if (Math.random() < prob) {
                    this.matrix.set(row, col, 1);
                }
            }
        }
    }

    toggleCell(i, j) {
        if (this.matrix.get(i, j) === 1) {
            this.matrix.set(i, j, 0)
        } else if (this.matrix.get(i, j) === 0) {
            this.matrix.set(i, j, 1)
        }
    }

    checkCell(i, j) {
        const neighb = this.matrix.count(this.matrix.getNeighborsId(i, j), 1);
        if (this.matrix.get(i, j) === 1 && this.survival.has(neighb) || (this.matrix.get(i, j) === 0 && this.birth.has(neighb))) {
            return true;
        }
        return false;
    }

    updateNextGen() {
        const nextGen = [];

        for (let i = 0; i < this.matrix.rows; i++) {
            nextGen[i] = [];

            for (let j = 0; j < this.matrix.cols; j++) {
                nextGen[i][j] = this.checkCell(i, j)? 1 : 0;
            }
        }
        // console.log(nextGen);
        this.matrix.grid = nextGen;
    }
}

