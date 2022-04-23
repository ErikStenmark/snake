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

  private keysPressed: string[] = [];

  private tickRate = 60;
  private elapsedDelta: number = 0;

  private snakePos: Array<{ x: number, y: number }> = [];

  private snakeYPos = 0;
  private snakeXPos = 0;
  private snakeDir = 'r';
  private snakeSize = 4;

  private blockAmount = 128;
  private playFieldWidth = 0;
  private blockSize = 0;

  private firstRender = true;


  private boundaries = {
    xStart: 0,
    xEnd: 0,
    yStart: 0,
    yEnd: 0
  }

  private foodPos: { x: number | undefined, y: number | undefined } = {
    x: undefined,
    y: undefined
  };

  constructor() {
    this.canvas = new Canvas();
    this.ctx = this.canvas.getCtx();
    this.lastFrameTime = new Date().getTime();

    this.setSize();
    window.addEventListener('resize', () => {
      this.setSize();
    });

    window.addEventListener('keydown', e => {
      if (!this.keysPressed.includes(e.key)) {
        this.keysPressed.push(e.key);
      }
    });

    window.addEventListener('keyup', e => {
      this.keysPressed = this.keysPressed.filter(k => k !== e.key);
    });
  }

  public onUpdate() {
    this.calculateTime();
    this.updateInterval();

    this.canvas.fill();
    this.displayFPS();
    this.drawPlayField();
    this.snake();
    this.food();
    this.firstRender = false;
  }

  private drawPlayField() {
    const lineWidth = 1;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'white';

    const smallerSide = this.width <= this.height ? this.width : this.height;
    const sideLength = Math.floor(smallerSide);
    const margin = Math.floor(smallerSide * 0.1);

    this.playFieldWidth = this.roundDownToMultiple(sideLength - margin * 2, this.blockAmount);
    this.blockSize = this.playFieldWidth / this.blockAmount;

    this.boundaries.xStart = (this.width - sideLength) / 2 + margin;
    this.boundaries.yStart = (this.height - sideLength) / 2 + margin;
    this.boundaries.xEnd = this.boundaries.xStart + this.playFieldWidth;
    this.boundaries.yEnd = this.boundaries.yStart + this.playFieldWidth;

    this.ctx.strokeRect(
      this.boundaries.xStart - lineWidth,
      this.boundaries.yStart - lineWidth,
      this.playFieldWidth + lineWidth + 1,
      this.playFieldWidth + lineWidth + 1
    );
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

    if (this.elapsedDelta < this.tickRate) {
      this.elapsedDelta += this.delta;
    } else {
      this.elapsedDelta = 0;
    }
  }

  private displayFPS() {
    this.fpsArr[this.intervalPos] = this.fps;
    this.deltaArr[this.intervalPos] = this.delta;

    this.avgFps = Math.round(this.fpsArr.reduce((a, b) => a + b, 0) / this.fpsArr.length);
    this.avgDelta = Math.round(this.deltaArr.reduce((a, b) => a + b, 0) / this.deltaArr.length);

    const fontSize = 18;
    const double = fontSize * 2;
    this.ctx.fillStyle = 'white';
    this.ctx.font = `${fontSize}px arial`;
    this.ctx.fillText(`score: ${this.snakePos.length - 1}`, this.boundaries.xStart, 0 + double);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`bound: ${JSON.stringify(this.boundaries)}`, this.width - double, 0 + double);
    this.ctx.fillText(
      `snake: 
    xS: ${this.snakeXPos} 
    xE: ${this.snakeXPos + this.snakeSize}
    yS: ${this.snakeYPos} 
    yE: ${this.snakeYPos + this.snakeSize}
    `, this.width - double, this.height - double);
  }

  private roundDownToMultiple(number: number, multiple: number) {
    return number - (number % multiple);
  }

  private food() {
    if (!this.foodPos.x && !this.foodPos.y) {
      const maxX = this.boundaries.xEnd - this.snakeSize;
      const maxY = this.boundaries.yEnd - this.snakeSize;
      this.foodPos.x = this.roundDownToMultiple(this.randomIntFromInterval(this.boundaries.xStart, maxX), this.snakeSize);
      this.foodPos.y = this.roundDownToMultiple(this.randomIntFromInterval(this.boundaries.yStart, maxY), this.snakeSize) + 2;
    }

    this.ctx.fillStyle = 'red';
    if (!!this.foodPos.x && !!this.foodPos.y) {
      this.ctx.fillRect(this.foodPos.x, this.foodPos.y, this.snakeSize, this.snakeSize);
    }
  }

  private randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private updateInterval() {
    this.intervalPos = this.intervalPos < this.maxInterval ? this.intervalPos + 1 : 0;
  }

  private getSneakHead() {
    return this.snakePos[this.snakePos.length - 1];
  }

  private eat() {
    const { x: headX, y: headY } = this.getSneakHead();
    const gotFood = headX === this.foodPos.x && headY === this.foodPos.y;

    if (gotFood) {
      this.foodPos.x = undefined;
      this.foodPos.y = undefined;
    }

    return gotFood;
  }

  private snake() {
    this.snakeSize = 4 * this.blockSize;

    if (this.firstRender) {
      this.snakePos.push({
        x: this.boundaries.xStart + 4 * this.snakeSize,
        y: this.snakeYPos = this.boundaries.yEnd - 4 * this.snakeSize
      });
    }

    const { x: headX, y: headY } = this.getSneakHead();


    this.snakePos.forEach((pos, i) => {
      this.ctx.fillStyle = i === this.snakePos.length - 1 ? 'lime' : 'darkgreen';
      this.ctx.strokeStyle = 'black';
      this.ctx.fillRect(pos.x, pos.y, this.snakeSize, this.snakeSize);
      this.ctx.strokeRect(pos.x + 1, pos.y + 1, this.snakeSize - 1, this.snakeSize - 1);
    });

    const latestKey = this.keysPressed.pop();

    if (latestKey === 'ArrowUp' && this.snakeDir !== 'd') {
      this.snakeDir = 'u'
    }

    if (latestKey === 'ArrowDown' && this.snakeDir !== 'u') {
      this.snakeDir = 'd'
    }

    if (latestKey === 'ArrowLeft' && this.snakeDir !== 'r') {
      this.snakeDir = 'l'
    }

    if (latestKey === 'ArrowRight' && this.snakeDir !== 'l') {
      this.snakeDir = 'r'
    }

    const shouldMoveRight = this.snakeDir === 'r';
    const shouldMoveLeft = this.snakeDir === 'l';
    const shouldMoveUp = this.snakeDir === 'u';
    const shouldMoveDown = this.snakeDir === 'd';

    const isWithinXEnd = headX + this.snakeSize < this.boundaries.xEnd;
    const isWithinXStart = headX > this.boundaries.xStart;
    const isWithinYStart = headY > this.boundaries.yStart;
    const isWithinYEnd = headY + this.snakeSize < this.boundaries.yEnd;

    const movementAmount = this.snakeSize;

    if (this.elapsedDelta >= this.tickRate) {
      if (shouldMoveRight && isWithinXEnd) {
        this.snakePos.push({ x: headX + movementAmount, y: headY });
        if (!this.eat()) {
          this.snakePos.shift();
        }
      }

      if (shouldMoveLeft && isWithinXStart) {
        this.snakePos.push({ x: headX - movementAmount, y: headY });
        if (!this.eat()) {
          this.snakePos.shift();
        }
      }

      if (shouldMoveUp && isWithinYStart) {
        this.snakePos.push({ x: headX, y: headY - movementAmount });
        if (!this.eat()) {
          this.snakePos.shift();
        }
      }

      if (shouldMoveDown && isWithinYEnd) {
        this.snakePos.push({ x: headX, y: headY + movementAmount });
        if (!this.eat()) {
          this.snakePos.shift();
        }
      }
    }
  }
}

export default Renderer;