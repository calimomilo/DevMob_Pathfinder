import Vector2 from "./Vector2.js";
const TAU = Math.PI * 2;

export default class Circle {
    constructor ({
        pos = new Vector2(),
        radius = 100,
        color = "hsl(180, 100%, 50%)",
        velocity = new Vector2()
    } = {}) {
        this.pos = pos;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    update(deltaTime) {
        this.pos.add(this.velocity.clone().multiply(deltaTime));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, TAU);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.radius;
        ctx.fill();
        ctx.closePath();
    }


}