import { Electron } from './preload';
import Canvas from './canvas';

declare global { interface Window { electron: Electron; } }

class Renderer {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;

  private width: number = 0;
  private height: number = 0;

  private maxInterval = 10;
  private lastFrameTime: number;
  private intervalPos: number = 0;

  private fps: number = 0;
  private avgFps: number = 0;
  private fpsArr: number[] = [];

  private delta: number = 0;
  private avgDelta: number = 0;
  private deltaArr: number[] = [];

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
    this.updateInterval();

    this.canvas.fill();
    this.drawPlayField();
    this.displayFPS();
  }

  private drawPlayField() {
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
    this.delta = timeNow - this.lastFrameTime;
    this.lastFrameTime = timeNow;

    const deltaInSeconds = this.delta / 1000;
    this.fps = Math.round(1 / deltaInSeconds);
  }

  private displayFPS() {
    this.fpsArr[this.intervalPos] = this.fps;
    this.deltaArr[this.intervalPos] = this.delta;

    this.avgFps = Math.round(this.fpsArr.reduce((a, b) => a + b, 0) / this.fpsArr.length);
    this.avgDelta = Math.round(this.deltaArr.reduce((a, b) => a + b, 0) / this.deltaArr.length);

    const fontSize = 18;
    const double = fontSize * 2;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'right';
    this.ctx.font = `${fontSize}px arial`;
    this.ctx.fillText(`delta: ${this.avgDelta} fps: ${this.avgFps}`, this.width - double, 0 + double);
  }

  private updateInterval() {
    this.intervalPos = this.intervalPos < this.maxInterval ? this.intervalPos + 1 : 0;
  }
}

export default Renderer;