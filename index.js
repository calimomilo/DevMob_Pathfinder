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
        x: (cell.col+0.5)*automaton.pixelSize,
        y: (cell.row+0.5)*automaton.pixelSize
    }) : null
}

const vectorToCell = (automaton, vector) => {
    const cell = {
        row: Math.floor(vector.y / automaton.pixelSize),
        col: Math.floor(vector.x / automaton.pixelSize)
    }

    return (cell.row <= automaton.rows && cell.col <= automaton.cols)? cell : null;
}

/* GENERATE WORLD */

const birth = [6, 7, 8];
const survival = [3, 4, 5, 6, 7, 8];

const stage = new AutomatonWithPathfinding({
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    pixelSize: 10,
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

/* DRAW CIRCLE ON STARTING POINT */

const startCell = stage.getRandomCell(1);

const circle = new Circle({
    pos: cellToVector(stage, startCell),
    radius: Math.floor(stage.pixelSize*0.45),
})
// console.log(circle);
circle.draw(ctx);

/* SELECT END POINT AND FLOW */

let endCell = {};
let moving = false;

canvas.addEventListener('pointerdown', (event) => {
    if (!moving) {
        endCell = vectorToCell(stage, {
            x: event.clientX,
            y: event.clientY
        });
        
        if (endCell && stage.matrix[endCell.row][endCell.col] === 1) {
            // stage.render2D(ctx);
            // circle.draw(ctx);
            // stage.drawCell(ctx, endCell.row, endCell.col, '#db0202');
            moving = true;
            stage.flowFieldTo(endCell.row, endCell.col);
            animateFlow();
            MainLoop.start();
        }
    }
})

/* FLOW ANIMATION SETUP */

const tweens = new Tweens();

const animateFlow = () => {
    const tweenStart = circle.pos;
    const nextCell = stage.getFlowMap()[vectorToCell(stage, tweenStart).row][vectorToCell(stage, tweenStart).col];
    const tweenEnd = cellToVector(stage, nextCell);
    const distance = tweenEnd.clone().add(tweenStart.clone().multiply(-1)).length();

    // console.log(tweenStart, tweenEnd, distance, (distance * 10))
    tweens.create({
        from: 0,
        to: 1,
        dur: distance * 10,
        ease: 'linear',
        animate: progress => {
            circle.pos = tweenStart.clone().lerp(tweenEnd, progress);
        },
        onComplete: stage.getFlowMap()[nextCell.row][nextCell.col]? animateFlow : () => moving = false
    });
}

const tickUpdate = (dt) => {
    tweens.update(dt);
}

const tickRender = (t) => {
    stage.render2D(ctx);
    stage.drawCell(ctx, endCell.row, endCell.col, '#db0202');
    circle.draw(ctx);
}

MainLoop
  .setUpdate(tickUpdate)
  .setDraw(tickRender);

// document.addEventListener('keyup', e => {
//     const pause = ['KeyP', 'Enter', 'Space']

//     if(pause.includes(e.code)) {
//         if (MainLoop.isRunning()) {
//             console.log('stop');
//             MainLoop.stop();
//         } else {
//             console.log('start');
//             MainLoop.start();
//         }
//     }
// })