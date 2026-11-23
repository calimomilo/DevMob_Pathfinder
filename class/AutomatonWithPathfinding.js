import Automaton from "./Automaton.js";

export default class AutomatonWithPathfinding extends Automaton {
    constructor({
        width,
        height,
        pixelSize = 5,
        freeColor = "hsl(0, 0%, 100%)",
        wallColor = "hsl(0, 0%, 0%)",
        inaccessibleColor = "hsl(0, 100%, 80%)",
        birth = [],
        survival = []
    } = {}) {
        super({width: width, height: height, pixelSize: pixelSize, aliveColor: freeColor, deadColor: wallColor, birth: birth, survival: survival});
        this. inaccessibleColor = inaccessibleColor;
    }

    getWalkableNeighbors({ row, col }) {
        const indexes = [];

        // force check order to get sides before corners
        const checkRows = [-1, 0, 1, 0, -1, 1, 1, -1];
        const checkCols = [0, -1, 0, 1, -1, -1, 1, 1];

        for (let index = 0; index < 8; index++) {
            const i = checkRows[index];
            const j = checkCols[index];
                // check inside of matrix bounds
            if (row+i >= 0 && row+i <this.rows && col+j >= 0 && col+j <this.cols) {
                // in case of corners
                if (i !== 0 && j !== 0) {
                    // check corner and sides are free
                    if (this.matrix[row+i][col+j] === 1 
                        && this.matrix[row+i][col] === 1
                        && this.matrix[row][col+j] === 1) {
                        indexes.push({
                            row: row+i,
                            col: col+j
                        });
                    }
                } else if (this.matrix[row+i][col+j] === 1) {
                    indexes.push({
                        row: row+i,
                        col: col+j
                    });
                }
            }
        }

        return indexes;
    }

    initFlowMap() {
        this.flowMap = [];
        for (let row = 0; row < this.rows; row++) {
            this.flowMap[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.flowMap[row][col] = false;
            }
        }
    }

    flowFieldTo({ row, col }) {
        this.initFlowMap();
        const frontier = [];
        frontier.push({ row, col });
        this.flowMap[row][col] = { row, col };

        while (frontier.length > 0) {
            const cell = frontier.shift();

            this.getWalkableNeighbors(cell).forEach(next => {
            if (this.flowMap[next.row][next.col] === false) {
                frontier.push(next);
                this.flowMap[next.row][next.col] = cell;
            }
            });
        }
        this.flowMap[row][col] = false;
    }

    getFlowMap() {
        return this.flowMap ?? [];
    }

    addInaccessible({ row, col }) {
        this.flowFieldTo({ row: row, col: col });
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j< this.cols; j++) {
                if (!(i === row && j === col) && !this.flowMap[i][j] && this.matrix[i][j] === 1) {
                    this.matrix[i][j] = -1;
                }
            }   
        }
    }
    
    render2D(ctx) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.drawCell(ctx, { row, col }, this.matrix[row][col] === 1? this.aliveColor : this.matrix[row][col] === -1? this.inaccessibleColor : this.deadColor);               
            }
        }
    }
}