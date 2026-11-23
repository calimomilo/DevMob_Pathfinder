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

    getRows() {
        return this.rows;
    }
    
    getCols() {
        return this.cols;
    }

    getMatrix() {
        return this.matrix;
    }

    getPixelSize() {
        return this.pixelSize;
    }

    getRandomCell(val = false) {
        const cell = {};

        do {
            const row = Math.floor(Math.random()*this.rows);
            const col = Math.floor(Math.random()*this.cols);

            cell.row = row;
            cell.col = col;
            
            // console.log(i, j, this.matrix[i][j], val);
        } while (val && this.matrix[cell.row][cell.col] !== val)
        
        return cell;
    }

    setCell({ row, col }, val) {
        this.matrix[row][col] = val;
    }

    randomize(prob) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (Math.random() < prob) {
                    this.matrix[row][col] = 1;
                }
            }
        }
    }

    /**
     * Returns the indexes of all neighboring cells of a matrix cell inside a certain distance ; cells outside of the matrix bounds are not taken into account
     * @param {number} row cell row
     * @param {number} col cell column
     * @param {number} d distance from the cell
     * @returns an array of the indexes of all neighboring cells
     */
    getNeighborsId({ row, col }, d = 1) {
            
        const indexes = [];

        for (let i = -d; i <= d; i++) {
            for (let j = -d; j <= d ; j++) {
                if (!(i === 0 && j === 0)) {
                    if (row+i >= 0 && row+i <this.rows && col+j >= 0 && col+j <this.cols) {
                        indexes.push({
                            row: row+i,
                            col: col+j
                        });
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
        return indexes.map(({ row, col }) => this.matrix[row][col] === val ? 1 : 0).reduce((a, b) => a+b, 0);
    }

    /**
     * Checks if the given cell survives, dies, or is born on the next generation
     * @param {number} row cell row
     * @param {number} col cell column
     * @returns true if the cell is alive on the next generation, false otherwise
     */
    checkCellSurvival({ row, col }) {
        const neighb = this.count(this.getNeighborsId({ row: row, col: col}), 1);
        if (this.matrix[row][col] === 1 && this.survival.has(neighb) || (this.matrix[row][col] === 0 && this.birth.has(neighb))) {
            return true;
        }
        return false;
    }

    updateNextGen() {
        const nextGen = [];

        for (let row = 0; row < this.rows; row++) {
            nextGen[row] = [];

            for (let col = 0; col < this.cols; col++) {
                nextGen[row][col] = this.checkCellSurvival({ row: row, col: col })? 1 : 0;
            }
        }
        // console.log(nextGen);
        this.matrix = nextGen;
    }

    render2D(ctx) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.drawCell(ctx, { row: row, col: col }, this.matrix[row][col] === 1? this.aliveColor : this.deadColor);               
            }
        }
    }

    drawCell(ctx, { row, col }, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(col*this.pixelSize, row*this.pixelSize, this.pixelSize, this.pixelSize);
        ctx.fill();
        ctx.closePath();
    }
}
