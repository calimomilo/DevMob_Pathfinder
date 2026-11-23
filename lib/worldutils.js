import { vectorToCell } from "./utils.js";

export const regenWorld = (stage, circle) => {
    const currentCell = vectorToCell(stage, circle.getPos());
    do {
        stage.randomize(0.55);
        for (let i = 0; i < 8; i++) {
            stage.updateNextGen();
        }
        console.log(circle.getPos());
    } while (stage.getMatrix()[currentCell.row][currentCell.col] === 0)
    
    stage.addInaccessible(currentCell);
}
