import Automaton from "./class/Automaton.js";
import AutomatonWithPathfinding from "./class/AutomatonWithPathfinding.js";
import Circle from "./class/Circle.js";
import Vector2D from "./class/Vector2D.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const birth = [6, 7, 8];
const survival = [3, 4, 5, 6, 7, 8];

const stage = new AutomatonWithPathfinding({
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    pixelSize: 20,
    aliveColor: "hsl(206, 70%, 10%)",
    deadColor: "hsl(118, 44%, 60%)",
    birth: birth,
    survival: survival
});

/* GENERATE WORLD */

stage.randomize(0.55);
// console.log(stage.getAutomaton());
stage.render2D(ctx);

for (let i = 0; i < 8; i++) {
    // setTimeout(() => {
    //     stage.updateNextGen();
    //     stage.render2D(ctx);
    // }, 100*i+300)
    stage.updateNextGen();
}
stage.render2D(ctx);

/* SELECT START AND END POINTS */

const startCell = stage.getRandomCell(1);
const endCell = stage.getRandomCell(1);

const circle = new Circle({
    pos: new Vector2D({
        x: (startCell.col + 0.5) * stage.pixelSize,
        y: (startCell.row + 0.5) * stage.pixelSize
    }),
    radius: Math.floor(stage.pixelSize*0.45),
})
console.log(circle);
circle.draw(ctx);

// stage.drawCell(ctx, startCell.row, startCell.col, '#36f1eb');
stage.drawCell(ctx, endCell.row, endCell.col, '#db0202');

/*  */