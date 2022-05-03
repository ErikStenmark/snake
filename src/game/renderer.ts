import { Electron } from './preload';
import Canvas from './canvas';
import { defaultGameOpts, GameOptions, GameOptSize, GameOptSpeed } from '../components/main-menu';

declare global { interface Window { electron: Electron; } };

type Position = { x: number; y: number };
type Direction = 'l' | 'r' | 'u' | 'd';

type SnakeDirection = Direction | undefined;

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

  private snakeDir: SnakeDirection = undefined;
  private snakeSize = 4;

  private blockAmount = 128;
  private playFieldWidth = 0;
  private blockSize = 0;

  private coordinates: Position[] = [];

  private firstRender = true;
  private isPaused = false;

  private options: GameOptions = defaultGameOpts;

  private dataCB: (...args: any) => void = () => { }

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

    window.addEventListener('resize', this.resizeCB);
    window.addEventListener('keydown', this.keyDownCB);
    window.addEventListener('keyup', e => this.keyUpCB);
  }

  private keyDownCB = (e: KeyboardEvent) => {
    if (!this.keysPressed.includes(e.key)) {
      this.keysPressed.push(e.key);
    }
  }

  private resizeCB = () => {
    this.setSize();
    this.calculatePlayArea();
    this.getAllCoordinates();
  }

  private keyUpCB = (e: KeyboardEvent) => this.keysPressed = this.keysPressed.filter(k => k !== e.key);

  public setOptions(options: any) {
    this.options = options;
  }

  public onUpdate() {
    if (this.firstRender) {
      this.getOptions();
    }

    this.calculateTime();
    this.updateInterval();

    this.canvas.fill();

    if (this.options.fps === 'on') {
      this.displayFPS();
    }

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

  public setDataCB(cb: (...args: any) => void) {
    this.dataCB = cb;
    this.dataCB({ score: !!this.snakePos.length ? this.snakePos.length - 1 : 0 });
  }

  private getOptions() {
    const sizeMap: { [key in GameOptSize]: number } = {
      large: 1,
      medium: 2,
      small: 4
    }
    this.blockAmount = this.blockAmount / sizeMap[this.options.size];

    const speedMap: { [key in GameOptSpeed]: number } = {
      fast: 1,
      medium: 3,
      slow: 6
    }
    this.tickRate = this.tickRate * speedMap[this.options.speed];
  }

  public endGame() {
    window.removeEventListener('keyup', this.keyUpCB);
    window.removeEventListener('keydown', this.keyDownCB);
    window.removeEventListener('reset', this.resizeCB);
    this.canvas.removeCanvas();
  }

  public pause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  private getSmallerWindowSide() {
    return this.width <= this.height ? this.width : this.height;
  }

  private calculatePlayArea() {
    const windowSmallerSide = this.getSmallerWindowSide();
    const windowSideLength = Math.floor(windowSmallerSide);
    const margin = Math.floor(this.getFontSize() + windowSmallerSide * 0.1);

    this.playFieldWidth = Math.round(windowSideLength - margin * 2);
    this.blockSize = this.playFieldWidth / this.blockAmount;

    this.boundaries.xStart = (this.width - windowSideLength) / 2 + margin;
    this.boundaries.yStart = (this.height - windowSideLength) / 2 + margin;
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

  private getFontSize() {
    const smallerSide = this.getSmallerWindowSide();
    const windowBased = smallerSide / 25;
    const min = 10;

    return windowBased > min ? windowBased : min;
  }

  private getTextRowHeight() {
    return {
      up: this.getFontSize() * 2,
      down: this.boundaries.yEnd + this.getFontSize() * 2
    }
  }

  private drawCoordinates() {
    this.ctx.strokeStyle = '#222';
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

  private getFont() {
    return `${this.getFontSize()}px arial`;
  }

  private setFont() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = this.getFont();
  }

  private displayFPS() {
    this.fpsArr[this.intervalPos] = this.fps;
    this.deltaArr[this.intervalPos] = this.delta;

    this.avgFps = Math.round(this.fpsArr.reduce((a, b) => a + b, 0) / this.fpsArr.length);
    this.avgDelta = Math.round(this.deltaArr.reduce((a, b) => a + b, 0) / this.deltaArr.length);

    this.setFont();
    this.ctx.textAlign = 'right';
    const { down } = this.getTextRowHeight();

    const text = `fps: ${this.avgFps} delta: ${this.avgDelta}`;
    this.ctx.fillText(text, this.boundaries.xEnd, down);
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

  private getSneakHeadCoordinateIndex() {
    return this.snakePos[this.snakePos.length - 1];
  }

  private getSnakeFirstBodyCoordinateIndex() {
    return this.snakePos.length > 1 ? this.snakePos[this.snakePos.length - 2] : null;
  }

  private eat() {
    const headCoordinateIndex = this.getSneakHeadCoordinateIndex();
    const gotFood = headCoordinateIndex === this.foodPos;

    if (gotFood) {
      this.dataCB({ score: this.snakePos.length - 1 });
      this.foodPos = this.noFoodPos;
    }

    return gotFood;
  }

  private snakeIncludesCoordinateIndex(index: number) {
    return this.snakePos.slice(1, this.snakePos.length - 1).includes(index);
  }

  private playFieldIncludesCoordinateIndex(index: number) {
    return !!this.coordinates[index];
  }

  private getSnakeSize() {
    return this.snakeSize * this.blockSize;
  }

  private getSnakeNextPos(direction: Direction) {
    const headCoordinateIndex = this.getSneakHeadCoordinateIndex();
    const { x: headX, y: headY } = this.getCoordinateByIndex(headCoordinateIndex);
    const nextPos = { x: headX, y: headY };

    const movementAmount = this.getSnakeSize();

    if (direction === 'r') {
      nextPos.x = headX + movementAmount;
    }

    if (direction === 'l') {
      nextPos.x = headX - movementAmount;
    }

    if (direction === 'u') {
      nextPos.y = headY - movementAmount;
    }

    if (direction === 'd') {
      nextPos.y = headY + movementAmount;
    }

    return nextPos;
  }

  private teleportIfNeeded(position: Position): Position {
    if (this.options.walls === 'on') {
      return position;
    }

    let { x, y } = position;
    const { xStart, xEnd, yStart, yEnd } = this.boundaries;
    const headIndex = this.getSneakHeadCoordinateIndex();

    if (x >= xEnd) {
      const newIndex = this.getCoordinateByIndex(headIndex - ((this.blockAmount / 4) - 1));
      x = newIndex.x;
    }

    if (x < xStart) {
      const newIndex = this.getCoordinateByIndex(headIndex + ((this.blockAmount / 4) - 1));
      x = newIndex.x;
    }

    if (y >= yEnd) {
      const rowBlocks = (this.blockAmount / 4) - 1;
      const newIndex = this.getCoordinateByIndex(headIndex - ((rowBlocks * rowBlocks) + rowBlocks));
      y = newIndex.y;
    }

    if (y < yStart) {
      const rowBlocks = (this.blockAmount / 4) - 1;
      const newIndex = this.getCoordinateByIndex(headIndex + ((rowBlocks * rowBlocks) + rowBlocks));
      y = newIndex.y;
    }

    return { x, y };
  }

  private snake() {
    const snakeSize = this.getSnakeSize();

    const moveTo = (position: Position) => {
      if (!this.isPaused) {
        const warpedPos = this.teleportIfNeeded(position);
        const posIndex = this.getCoordinateIndex(warpedPos);

        if (!this.snakeIncludesCoordinateIndex(posIndex) && this.playFieldIncludesCoordinateIndex(posIndex)) {
          this.snakePos.push(posIndex);
          if (!this.eat()) {
            this.snakePos.shift();
          }
        }
      }
    }

    const isFirstBodyInDirection = (direction: Direction) => {
      const firstBodyCoIndex = this.getSnakeFirstBodyCoordinateIndex();
      const nextPosCoordinate = this.getSnakeNextPos(direction);
      const nextPosCoordinateIndex = this.getCoordinateIndex(nextPosCoordinate);
      return nextPosCoordinateIndex === firstBodyCoIndex;
    }

    if (this.firstRender) {
      this.snakePos.push(1);
    }

    this.snakePos.forEach((pos, i) => {
      this.ctx.fillStyle = i === this.snakePos.length - 1 ? 'lime' : 'darkgreen';
      this.ctx.strokeStyle = 'black';
      const coordinate = this.getCoordinateByIndex(pos);
      this.ctx.fillRect(coordinate.x, coordinate.y, snakeSize, snakeSize);
      this.ctx.strokeRect(coordinate.x + 1, coordinate.y + 1, snakeSize - 1, snakeSize - 1);
    });

    const latestKey = this.keysPressed.pop();

    if (latestKey === 'ArrowUp' && !isFirstBodyInDirection('u')) {
      this.snakeDir = 'u'
    }

    if (latestKey === 'ArrowDown' && !isFirstBodyInDirection('d')) {
      this.snakeDir = 'd'
    }

    if (latestKey === 'ArrowLeft' && !isFirstBodyInDirection('l')) {
      this.snakeDir = 'l'
    }

    if (latestKey === 'ArrowRight' && !isFirstBodyInDirection('r')) {
      this.snakeDir = 'r'
    }

    if (this.elapsedDelta >= this.tickRate && !!this.snakeDir) {
      const nextPos = this.getSnakeNextPos(this.snakeDir);
      moveTo(nextPos);
    }
  }
}

export default Renderer;