import Canvas from './canvas';
import { Electron } from '../../electron/preload';

declare global { interface Window { electron: Electron; } };

abstract class Renderer {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;

  private screenWidth: number = 0;
  private screenHeight: number = 0;

  private maxTick: number = 10;
  private tickPosition: number = 0;
  private previousFrameTime: number;

  private fps: number = 0;
  private avgFps: number = 0;
  private fpsArray: number[] = [];

  private delta: number = 0;
  private avgDelta: number = 0;
  private deltaArray: number[] = [];

  private keysPressed: string[] = [];
  private isPaused: boolean = false;
  private isFirstRender: boolean = true;

  protected dataCB: (...args: any) => void = null;

  constructor() {
    this.canvas = new Canvas();
    this.ctx = this.canvas.getCtx();
    this.previousFrameTime = new Date().getTime();

    this.setSize();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  protected abstract onUpdate(): void;
  protected abstract resize(width: number, height: number): void;

  public update() {
    this.updateTickPosition();
    this.calculateTime();
    this.calculateAvgTime();

    this.canvas.fill();

    this.onUpdate();

    if (this.isFirstRender) {
      this.isFirstRender = false;
    }
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  public endGame() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeCanvas();
  }

  public setDataCB(cb: (...args: any) => void) {
    this.dataCB = cb;
  }

  protected getFps() {
    return this.fps;
  }

  protected getAvgFps() {
    return this.avgFps;
  }

  protected getDelta() {
    return this.delta;
  }

  protected getAvhDelta() {
    return this.avgDelta;
  }

  protected getCanvas() {
    return this.canvas;
  }

  protected getCtx() {
    return this.ctx;
  }

  protected getIsFirstRender() {
    return this.isFirstRender;
  }

  protected getScreenSize() {
    return {
      width: this.screenWidth,
      height: this.screenHeight
    }
  }

  protected getIsPaused() {
    return this.isPaused;
  }

  protected getPressedKeys() {
    return this.keysPressed;
  }

  private onResize = () => {
    this.setSize();
    this.resize(this.screenWidth, this.screenHeight);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.keysPressed.includes(e.key)) {
      this.keysPressed.push(e.key);
    }
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keysPressed = this.keysPressed.filter(k => k !== e.key);
  }

  private setSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.canvas.setSize(this.screenWidth, this.screenHeight);
  }

  private calculateTime() {
    const timeNow = new Date().getTime();
    this.delta = timeNow - this.previousFrameTime;
    this.previousFrameTime = timeNow;

    const deltaInSeconds = this.delta / 1000;
    this.fps = Math.round(1 / deltaInSeconds);
  }

  private calculateAvgTime() {
    this.fpsArray[this.tickPosition] = this.fps;
    this.deltaArray[this.tickPosition] = this.delta;

    this.avgFps = Math.round(this.fpsArray.reduce((a, b) => a + b, 0) / this.fpsArray.length);
    this.avgDelta = Math.round(this.deltaArray.reduce((a, b) => a + b, 0) / this.deltaArray.length);
  }

  private updateTickPosition() {
    this.tickPosition = this.tickPosition < this.maxTick
      ? this.tickPosition + 1
      : 0;
  }
}

export default Renderer;