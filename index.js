import AutomatonRenderer from "./class/AutomatonRenderer.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const birth = [6, 7, 8];
const survival = [3, 4, 5, 6, 7, 8];

const stage = new AutomatonRenderer({
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    pixelSize: 20,
    aliveColor: "hsl(206, 70%, 10%)",
    deadColor: "hsl(118, 44%, 60%)",
    birth: birth,
    survival: survival
});

stage.automaton.randomize(0.55);
for (let i = 0; i < 8; i++) {
    stage.automaton.updateNextGen();
    
}
stage.render2D(ctx);