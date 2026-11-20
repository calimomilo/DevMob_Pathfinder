import Automaton from "./Automaton.js";

export default class AutomatonWithPathfinding extends Automaton {
    getWalkableNeighbors({row, col}) {
        const indexes = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    // check inside of matrix bounds
                    if (row+i >= 0 && row+i <this.rows && col+j >= 0 && col+j <this.cols) {
                        // in case of corners
                        if (i !== 0 && j !== 0) {
                            // check corner and sides are free
                            if (this.matrix[row+i][col+j] === this.matrix[row+i][col] === this.matrix[row][col+j] === 1) {
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

    flowFieldTo(row, col) {
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
}