import { moduloEuclidian } from "../lib/math.js";

export default class Matrix2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];

        for (let i = 0; i < rows; i++) {
            this.grid[i] = [];

            for (let j = 0; j < cols; j++) {
                this.grid[i][j] = 0;
            }
        }
        
        // console.log(this.grid)
    }

    set(row, col, val) {
        this.grid[row][col] = val;
    }

    get(row, col) {
        return this.grid[row][col];
    }

    getNeighborsId(row, col, d = 1) {
            
        const indexes = [];

        for (let i = -d; i <= d; i++) {
            for (let j = -d; j <= d ; j++) {
                if (!(i === 0 && j === 0)) {
                    indexes.push([
                        moduloEuclidian(row+i, this.rows), 
                        moduloEuclidian(col+j, this.cols)
                    ]);
                }
            }        
        }

        return indexes;
    }

    count(indexes, val) {
        return indexes.map(([row, col]) => this.grid[row][col] === val ? 1 : 0).reduce((a, b) => a+b, 0);
    }
}