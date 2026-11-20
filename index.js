import Automaton from "./class/Automaton.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const birth = [6, 7, 8];
const survival = [3, 4, 5, 6, 7, 8];

const stage = new Automaton({
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    pixelSize: 20,
    aliveColor: "hsl(206, 70%, 10%)",
    deadColor: "hsl(118, 44%, 60%)",
    birth: birth,
    survival: survival
});

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

const start = stage.getRandomCell(1);
const end = stage.getRandomCell(1);

console.log(start, end);

stage.drawCell(ctx, start.row, start.col, '#36f1eb')
stage.drawCell(ctx, end.row, end.col, '#db0202')