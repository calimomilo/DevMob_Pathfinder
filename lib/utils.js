import Vector2D from "../class/Vector2D.js";

export const cellToVector = (automaton, cell) => {
    return cell? new Vector2D({
        x: (cell.col+0.5)*automaton.getPixelSize(),
        y: (cell.row+0.5)*automaton.getPixelSize()
    }) : null
}

export const vectorToCell = (automaton, vector) => {
    const cell = {
        row: Math.floor(vector.y / automaton.getPixelSize()),
        col: Math.floor(vector.x / automaton.getPixelSize())
    }

    return (cell.row <= automaton.getRows() && cell.col <= automaton.getCols())? cell : null;
}
