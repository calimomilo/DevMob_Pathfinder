import Automaton from "./Automaton.js";

export default class AutomatonRenderer {
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

    const rows = Math.floor(this.height/this.pixelSize);
    const cols = Math.floor(this.width/this.pixelSize);

    // console.log(rows, cols);

    this.automaton = new Automaton(rows, cols, birth, survival)
    }

    getAutomaton() {
        return this.automaton;
    }

    render2D(ctx) {
        for (let row = 0; row < this.automaton.getMatrix().rows; row++) {
            for (let col = 0; col < this.automaton.getMatrix().cols; col++) {
                ctx.beginPath();
                ctx.fillStyle = this.automaton.getMatrix().get(row, col) === 1? this.aliveColor : this.deadColor;
                ctx.rect(col*this.pixelSize, row*this.pixelSize, this.pixelSize, this.pixelSize);
                ctx.fill();
                ctx.closePath();                
            }
        }
    }
}

