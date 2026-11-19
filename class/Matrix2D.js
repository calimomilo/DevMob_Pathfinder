export default class Matrix2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        for (let i = 0; i < rows; i++) {
            this.matrix[i] = [];

            for (let j = 0; j < cols; j++) {
                this.matrix[i][j] = 0;
            }
        }
    }

    set(row, col, val) {
        this.matrix[row][col] = val;
    }

    get(row, col) {
        return this.matrix[row][col];
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
}