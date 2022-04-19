import { Electron } from './preload';
import Canvas from './canvas';

declare global { interface Window { electron: Electron; } }

class Main {
    private canvas: Canvas;
    private ctx: CanvasRenderingContext2D;
    private dir = 0.01;
    private val = 0;

    constructor() {
        this.canvas = new Canvas();
        this.ctx = this.canvas.getCtx();
    }

    public onUpdate() {
        this.val += this.dir;

        if (this.val <= 0 || this.val >= 1) {
            this.dir = this.dir * -1;
        }

        this.canvas.fill();

        this.ctx.beginPath();
        this.ctx.arc(280, 190, 50, 0, 2 * Math.PI);

        this.ctx.fillStyle = `rgba(204, 204, 0, ${this.val - 0.2})`;
        this.ctx.fill();

        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.val + 0.2 * 3})`;
        this.ctx.fillText('Hello World', 200, 200);
    }
}

(async () => {
    const main = new Main();

    const loop = () => {
        window.requestAnimationFrame(gameLoop);
    }

    const gameLoop = () => {
        main.onUpdate();
        loop();
    }

    loop();
})();