import Automaton from "./class/Automaton.js";
import AutomatonWithPathfinding from "./class/AutomatonWithPathfinding.js";
import Circle from "./class/Circle.js";
import Tweens from "./class/Tweens.js";
import Vector2D from "./class/Vector2D.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const cellToVector = (automaton, cell) => {
    return cell? new Vector2D({
        x: (cell.col+0.5)*automaton.getPixelSize(),
        y: (cell.row+0.5)*automaton.getPixelSize()
    }) : null
}

const vectorToCell = (automaton, vector) => {
    const cell = {
        row: Math.floor(vector.y / automaton.getPixelSize()),
        col: Math.floor(vector.x / automaton.getPixelSize())
    }

    return (cell.row <= automaton.getRows() && cell.col <= automaton.getCols())? cell : null;
}

/* GENERATE WORLD */

const birth = [6, 7, 8];
const survival = [3, 4, 5, 6, 7, 8];

const stage = new AutomatonWithPathfinding({
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    pixelSize: 15,
    freeColor: "hsl(206, 70%, 10%)",
    wallColor: "hsl(118, 44%, 60%)",
    inaccessibleColor: "hsl(205, 18%, 28%)",
    birth: birth,
    survival: survival
});

stage.randomize(0.55);

for (let i = 0; i < 8; i++) {
    stage.updateNextGen();
}

/* DRAW CIRCLE ON STARTING POINT AND RENDER */

const startCell = stage.getRandomCell(1);

const circle = new Circle({
    pos: cellToVector(stage, startCell),
    radius: Math.floor(stage.getPixelSize()*0.45),
})
stage.addInaccessible(startCell);
stage.render2D(ctx);
circle.draw(ctx);

/* SELECT END POINT AND FLOW */

let endCell = {};
let moving = false;

canvas.addEventListener('pointerdown', (event) => {
    if (!moving) {
        let newEndCell = vectorToCell(stage, {
            x: event.clientX,
            y: event.clientY
        });

        if (newEndCell && stage.getMatrix()[newEndCell.row][newEndCell.col] === 1) {
            moving = true;
            endCell = newEndCell;

            stage.flowFieldTo({ row: endCell.row, col: endCell.col });
            animateFlow();
            MainLoop.start();
        }
    }
})

/* FLOW ANIMATION SETUP */

const tweens = new Tweens();

const animateFlow = () => {
    const tweenStart = circle.getPos();
    const nextCell = stage.getFlowMap()[vectorToCell(stage, tweenStart).row][vectorToCell(stage, tweenStart).col];

    if (nextCell) {
        const tweenEnd = cellToVector(stage, nextCell);
        const distance = tweenEnd.clone().add(tweenStart.clone().multiply(-1)).length();

        tweens.create({
            from: 0,
            to: 1,
            dur: distance * 5,
            ease: 'linear',
            animate: progress => {
                circle.pos = tweenStart.clone().lerp(tweenEnd, progress);
            },
            onComplete: animateFlow
        });
    } else {
        moving = false;
    }
}

const tickUpdate = (dt) => {
    tweens.update(dt);
}

const tickRender = (t) => {
    stage.render2D(ctx);
    stage.drawCell(ctx, { row: endCell.row, col: endCell.col }, '#db0202');
    circle.draw(ctx);
}

MainLoop
  .setUpdate(tickUpdate)
  .setDraw(tickRender);
