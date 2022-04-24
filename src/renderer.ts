import { Electron } from './preload';
import Canvas from './canvas';

declare global { interface Window { electron: Electron; } }
type Position = { x: number; y: number };
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

  private tickRate = 20;
  private elapsedDelta: number = 0;

  private snakePos: number[] = [];

  private snakeDir = 'r';
  private snakeSize = 4;

  private blockAmount = 128;
  private playFieldWidth = 0;
  private blockSize = 0;

  private coordinates: Position[] = [];

  private firstRender = true;

  private boundaries = {
    xStart: 0,
    xEnd: 0,
    yStart: 0,
    yEnd: 0
  }

  private noFoodPos: number = -1;
  private foodPos: number = this.noFoodPos;

  constructor() {
    this.canvas = new Canvas();
    this.ctx = this.canvas.getCtx();
    this.lastFrameTime = new Date().getTime();

    this.setSize();
    window.addEventListener('resize', () => {
      this.setSize();
      this.calculatePlayArea();
      this.getAllCoordinates();
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

    if (this.firstRender) {
      this.calculatePlayArea();
      this.getAllCoordinates();
    }

    this.drawCoordinates();
    this.snake();
    this.food();

    if (this.firstRender) {
      this.firstRender = false;
    }
  }

  private calculatePlayArea() {
    const smallerSide = this.width <= this.height ? this.width : this.height;
    const sideLength = Math.floor(smallerSide);
    const margin = Math.floor(smallerSide * 0.1);

    this.playFieldWidth = Math.round(sideLength - margin * 2);
    this.blockSize = this.playFieldWidth / this.blockAmount;

    this.boundaries.xStart = (this.width - sideLength) / 2 + margin;
    this.boundaries.yStart = (this.height - sideLength) / 2 + margin;
    this.boundaries.xEnd = this.boundaries.xStart + this.playFieldWidth;
    this.boundaries.yEnd = this.boundaries.yStart + this.playFieldWidth;
  }

  private drawPlayField() {
    const lineWidth = 1;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'white';

    this.ctx.strokeRect(
      this.boundaries.xStart - lineWidth,
      this.boundaries.yStart - lineWidth,
      this.playFieldWidth + lineWidth + 1,
      this.playFieldWidth + lineWidth + 1
    );
  }

  private drawCoordinates() {
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;

    this.coordinates.forEach(pos => {
      this.ctx.strokeRect(pos.x + 1, pos.y + 1, this.getSnakeSize() - 2, this.getSnakeSize() - 2);
    })
  }

  private getAllCoordinates() {
    const coordinates: Position[] = [];

    let y = this.boundaries.yStart;

    while (y < this.boundaries.yEnd) {
      let x = this.boundaries.xStart;

      while (x < this.boundaries.xEnd) {
        coordinates.push({ x, y });
        x += this.getSnakeSize();
      }

      y += this.getSnakeSize();
    }

    this.coordinates = coordinates;
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
  }

  private getCoordinateIndex = (position: Position) => {
    return this.coordinates.findIndex(c => c.x === position.x && c.y === position.y);
  }

  private getCoordinateByIndex = (index: number) => {
    return this.coordinates[index];
  }

  private food() {
    let foodPos = this.foodPos;

    let firstRandomCoordinatePosition = 0;

    const needsNewFood = foodPos === this.noFoodPos && this.coordinates.length;

    if (needsNewFood) {
      firstRandomCoordinatePosition = this.randomIntFromInterval(0, this.coordinates.length - 1);
      foodPos = firstRandomCoordinatePosition;

      while (this.snakeIncludesCoordinateIndex(foodPos)) {
        foodPos += 1

        if (foodPos > this.coordinates.length - 1) {
          foodPos = 0;
        }

        if (foodPos === firstRandomCoordinatePosition) {
          foodPos = this.noFoodPos;
        }
      }

      this.foodPos = foodPos;
    }


    if (this.snakeIncludesCoordinateIndex(this.foodPos)) {
      this.foodPos = this.coordinates.findIndex((c, i) => !this.snakePos.includes(i)) || this.noFoodPos;
    }

    this.ctx.fillStyle = 'red';
    if (this.foodPos >= 0) {
      const coordinate = this.getCoordinateByIndex(this.foodPos);
      this.ctx.fillRect(coordinate.x, coordinate.y, this.getSnakeSize(), this.getSnakeSize());
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
    const headCoordinateIndex = this.getSneakHead();
    const gotFood = headCoordinateIndex === this.foodPos;

    if (gotFood) {
      this.foodPos = this.noFoodPos;
    }

    return gotFood;
  }

  private snakeIncludesCoordinateIndex(index: number) {
    return this.snakePos.includes(index);
  }

  private playFieldIncludesCoordinateIndex(index: number) {
    return !!this.coordinates[index];
  }

  private getSnakeSize() {
    return this.snakeSize * this.blockSize;
  }

  private snake() {
    const snakeSize = this.getSnakeSize();

    if (this.firstRender) {
      this.snakePos.push(1);
    }

    const headCoordinateIndex = this.getSneakHead();
    const { x: headX, y: headY } = this.getCoordinateByIndex(headCoordinateIndex);

    this.snakePos.forEach((pos, i) => {
      this.ctx.fillStyle = i === this.snakePos.length - 1 ? 'lime' : 'darkgreen';
      this.ctx.strokeStyle = 'black';
      const coordinate = this.getCoordinateByIndex(pos);
      this.ctx.fillRect(coordinate.x, coordinate.y, snakeSize, snakeSize);
      this.ctx.strokeRect(coordinate.x + 1, coordinate.y + 1, snakeSize - 1, snakeSize - 1);
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

    const nextPos = { x: headX, y: headY };
    const movementAmount = snakeSize;

    const moveTo = (position: Position) => {
      const posIndex = this.getCoordinateIndex(position);

      if (!this.snakeIncludesCoordinateIndex(posIndex) && this.playFieldIncludesCoordinateIndex(posIndex)) {
        this.snakePos.push(posIndex);
        if (!this.eat()) {
          this.snakePos.shift();
        }
      }
    }

    if (this.elapsedDelta >= this.tickRate) {
      if (shouldMoveRight) {
        nextPos.x = headX + movementAmount;
        moveTo(nextPos);
      }

      if (shouldMoveLeft) {
        nextPos.x = headX - movementAmount;
        moveTo(nextPos);
      }

      if (shouldMoveUp) {
        nextPos.y = headY - movementAmount;
        moveTo(nextPos);
      }

      if (shouldMoveDown) {
        nextPos.y = headY + movementAmount;
        moveTo(nextPos);
      }
    }
  }
}

export default Renderer;