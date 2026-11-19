export default class Automaton {
    constructor({
        width,
        height,
        pixelSize = 5,
        aliveColor = "hsl(0, 0%, 100%)",
        deadColor = "hsl(0, 0%, 0%)",
        birth = [],
        survival = []
    } = {}) {

        this.width = width;
        this.height = height;
        this.pixelSize = pixelSize;
        this.aliveColor = aliveColor;
        this.deadColor = deadColor;

        this.rows = Math.floor(this.height/this.pixelSize);
        this.cols = Math.floor(this.width/this.pixelSize);
        this.matrix = [];

        for (let i = 0; i < this.rows; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = 0;
            }
        }

        this.birth = new Set();
        this.survival = new Set();
        
        birth.forEach(n => {
            this.birth.add(n);
        });
        survival.forEach(n => {
            this.survival.add(n);
        });

    }

    // getRows() {
    //     return this.rows;
    // }
    
    // getCols() {
    //     return this.cols;
    // }

    // getMatrix() {
    //     return this.matrix;
    // }

    // getCell(row, col) {
    //     return this.matrix[row][col];
    // }

    // setCell(row, col, val) {
    //     this.matrix[row][col] = val;
    // }

    randomize(prob) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (Math.random() < prob) {
                    this.matrix[i][j] = 1;
                }
            }
        }
    }

    toggleCell(i, j) {
        if (this.matrix[i][j] === 1) {
            this.matrix[i][j] = 0;
        } else if (this.matrix[i][j] === 0) {
            this.matrix[i][j] = 1;
        }
    }

    /**
     * Returns the indexes of all neighboring cells of a matrix cell inside a certain distance ; cells outside of the matrix bounds are not taken into account
     * @param {number} row cell row
     * @param {number} col cell column
     * @param {number} d distance from the cell
     * @returns an array of the indexes of all neighboring cells
     */
    getNeighborsId(row, col, d = 1) {
            
        const indexes = [];

        for (let i = -d; i <= d; i++) {
            for (let j = -d; j <= d ; j++) {
                if (!(i === 0 && j === 0)) {
                    if (row+i >= 0 && row+i <this.rows && col+j >= 0 && col+j <this.cols) {
                        indexes.push([row+i, col+j]);
                    }
                }
            }
        }

        return indexes;
    }

    /**
     * Counts how many times the specified value is present in the matrix at the specified indexes
     * @param {Array} indexes array of the indexes to count
     * @param {*} val value to count
     * @returns the amount of times the value is present
     */
    count(indexes, val) {
        return indexes.map(([row, col]) => this.matrix[row][col] === val ? 1 : 0).reduce((a, b) => a+b, 0);
    }

    /**
     * Checks if the given cell survives, dies, or is born on the next generation
     * @param {number} i cell row
     * @param {number} j cell column
     * @returns true if the cell is alive on the next generation, false otherwise
     */
    checkCellSurvival(i, j) {
        const neighb = this.count(this.getNeighborsId(i, j), 1);
        if (this.matrix[i][j] === 1 && this.survival.has(neighb) || (this.matrix[i][j] === 0 && this.birth.has(neighb))) {
            return true;
        }
        return false;
    }

    updateNextGen() {
        const nextGen = [];

        for (let i = 0; i < this.rows; i++) {
            nextGen[i] = [];

            for (let j = 0; j < this.cols; j++) {
                nextGen[i][j] = this.checkCellSurvival(i, j)? 1 : 0;
            }
        }
        // console.log(nextGen);
        this.matrix = nextGen;
    }

    render2D(ctx) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                ctx.beginPath();
                ctx.fillStyle = this.matrix[row][col] === 1? this.aliveColor : this.deadColor;
                ctx.rect(col*this.pixelSize, row*this.pixelSize, this.pixelSize, this.pixelSize);
                ctx.fill();
                ctx.closePath();                
            }
        }
    }
}
