import { Electron } from './preload';
import Canvas from './canvas';

declare global { interface Window { electron: Electron; } }

class Renderer {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;

  private width: number = 0;
  private height: number = 0;

  private lastFrameTime: number;
  private intervalPos: number = 0;

  private fps: number = 0;
  private displayFps: number = 0;
  private deltaTime: number = 0;
  private displayDelta: number = 0;

  constructor() {
    this.canvas = new Canvas();
    this.ctx = this.canvas.getCtx();
    this.lastFrameTime = new Date().getTime();

    this.setSize();
    window.addEventListener('resize', () => {
      this.setSize();
    });
  }

  public onUpdate() {
    this.calculateTime();
    this.canvas.fill();
    this.playField();
    this.drawFPS();
  }

  private playField() {
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'white';

    const sideLength = this.width <= this.height ? this.width : this.height;
    const margin = sideLength * 0.1;
    const side = sideLength - margin * 2;

    const xStart = (this.width - sideLength) / 2 + margin;
    const yStart = (this.height - sideLength) / 2 + margin;

    this.ctx.strokeRect(xStart, yStart, side, side);
  }

  private setSize() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.canvas.setSize(this.width, this.height);
  }

  private calculateTime() {
    const timeNow = new Date().getTime();
    this.deltaTime = timeNow - this.lastFrameTime;
    this.lastFrameTime = timeNow;

    const deltaInSeconds = this.deltaTime / 1000;
    this.fps = Math.round(1 / deltaInSeconds);

    if (this.intervalPos === 0) {
      this.displayDelta = this.deltaTime;
      this.displayFps = this.fps;
    }

    this.intervalPos = this.intervalPos < 10 ? this.intervalPos + 1 : 0;
  }

  private drawFPS() {
    const fontSize = 18;
    const double = fontSize * 2;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'right';
    this.ctx.font = `${fontSize}px arial`;
    this.ctx.fillText(`delta: ${this.displayDelta} fps: ${this.displayFps}`, this.width - double, 0 + double);
  }
}

export default Renderer;