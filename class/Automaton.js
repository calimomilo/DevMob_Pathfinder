import Matrix2D from "./Matrix2D.js";

export default class Automaton {
    constructor(
        rows, cols,
        birth = [],
        survival = []
    ) {
        this.birth = new Set();
        this.survival = new Set();
        
        birth.forEach(n => {
            this.birth.add(n);
        });
        survival.forEach(n => {
            this.survival.add(n);
        });

        this.matrix = new Matrix2D(rows, cols);
    }

    getMatrix() {
        return this.matrix;
    }

    randomize(prob) {
        for (let i = 0; i < this.matrix.rows; i++) {
            for (let j = 0; j < this.matrix.cols; j++) {
                if (Math.random() < prob) {
                    this.matrix.set(i, j, 1);
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

    /**
     * Checks if the given cell survives, dies, or is born on the next generation
     * @param {number} i cell row
     * @param {number} j cell column
     * @returns true if the cell is alive on the next generation, false otherwise
     */
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
        this.matrix.matrix = nextGen;
    }
}
