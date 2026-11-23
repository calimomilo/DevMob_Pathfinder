import Vector2D from "./Vector2D.js";
const TAU = Math.PI * 2;

export default class Circle {
    constructor ({
        pos = new Vector2D(),
        radius = 100,
        color = "hsl(180, 100%, 50%)",
    } = {}) {
        this.pos = pos;
        this.radius = radius;
        this.color = color;
    }

    getPos() {
        return this.pos;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, TAU);
        // ctx.shadowColor = this.color;
        // ctx.shadowBlur = this.radius;
        ctx.fill();
        ctx.closePath();
    }


}