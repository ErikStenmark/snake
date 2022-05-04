
import Renderer from './engine/renderer';

import {
  defaultGameOpts,
  GameOptions,
  GameOptSize,
  GameOptSpeed
} from '../components/main-menu';


type Position = { x: number; y: number };
type Direction = 'l' | 'r' | 'u' | 'd';

type SnakeDirection = Direction | undefined;

class Game extends Renderer {
  private tickRate = 20;
  private elapsedDelta: number = 0;
  private options: GameOptions = defaultGameOpts;

  private snakePos: number[] = [];
  private snakeDir: SnakeDirection = undefined;
  private snakeSize = 4;

  private noFoodPos: number = -1;
  private foodPos: number = this.noFoodPos;

  private blockAmount = 128;
  private blockSize = 0;

  private playFieldWidth = 0;
  private boundaries = { xStart: 0, xEnd: 0, yStart: 0, yEnd: 0 }
  private coordinates: Position[] = [];

  protected resize = () => {
    this.calculatePlayArea();
    this.getAllCoordinates();
  }

  public setOptions(options: any) {
    this.options = options;
  }

  public onUpdate() {
    if (this.getIsFirstRender()) {
      this.getOptions();
      this.calculatePlayArea();
      this.getAllCoordinates();
      this.dataCB({ score: !!this.snakePos.length ? this.snakePos.length - 1 : 0 });
    }

    if (this.options.fps === 'on') {
      this.displayFPS();
    }

    this.tick();
    this.drawPlayField();
    this.drawCoordinates();
    this.snake();
    this.food();

  }

  private tick() {
    const delta = this.getDelta();
    if (this.elapsedDelta >= this.tickRate) {
      this.elapsedDelta = 0;
    };

    this.elapsedDelta += delta;
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

  private getSmallerWindowSide() {
    const { height, width } = this.getScreenSize();
    return width <= height ? width : height;
  }

  private calculatePlayArea() {
    const { width, height } = this.getScreenSize();
    const windowSmallerSide = this.getSmallerWindowSide();
    const windowSideLength = Math.floor(windowSmallerSide);
    const margin = Math.floor(this.getFontSize() + windowSmallerSide * 0.1);

    this.playFieldWidth = Math.round(windowSideLength - margin * 2);
    this.blockSize = this.playFieldWidth / this.blockAmount;

    this.boundaries.xStart = (width - windowSideLength) / 2 + margin;
    this.boundaries.yStart = (height - windowSideLength) / 2 + margin;
    this.boundaries.xEnd = this.boundaries.xStart + this.playFieldWidth;
    this.boundaries.yEnd = this.boundaries.yStart + this.playFieldWidth;
  }

  private drawPlayField() {
    const ctx = this.getCtx();
    const lineWidth = 1;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    ctx.strokeRect(
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
    const ctx = this.getCtx();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;

    this.coordinates.forEach(pos => {
      ctx.strokeRect(pos.x + 1, pos.y + 1, this.getSnakeSize() - 2, this.getSnakeSize() - 2);
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

  private getFont() {
    return `${this.getFontSize()}px arial`;
  }

  private setFont() {
    const ctx = this.getCtx();
    ctx.fillStyle = 'white';
    ctx.font = this.getFont();
  }

  private displayFPS() {
    const ctx = this.getCtx();
    this.setFont();
    ctx.textAlign = 'right';
    const { down } = this.getTextRowHeight();

    const text = `fps: ${this.getAvgFps()} delta: ${this.getAvhDelta()}`;
    ctx.fillText(text, this.boundaries.xEnd, down);
  }

  private getCoordinateIndex = (position: Position) => {
    return this.coordinates.findIndex(c => c.x === position.x && c.y === position.y);
  }

  private getCoordinateByIndex = (index: number) => {
    return this.coordinates[index];
  }

  private food() {
    const ctx = this.getCtx();
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

    ctx.fillStyle = 'red';
    if (this.foodPos >= 0) {
      const coordinate = this.getCoordinateByIndex(this.foodPos);
      ctx.fillRect(coordinate.x, coordinate.y, this.getSnakeSize(), this.getSnakeSize());
    }
  }

  private randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
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
      if (!this.getIsPaused()) {
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

    if (this.getIsFirstRender()) {
      this.snakePos.push(1);
    }

    this.snakePos.forEach((pos, i) => {
      const ctx = this.getCtx();
      ctx.fillStyle = i === this.snakePos.length - 1 ? 'lime' : 'darkgreen';
      ctx.strokeStyle = 'black';
      const coordinate = this.getCoordinateByIndex(pos);
      ctx.fillRect(coordinate.x, coordinate.y, snakeSize, snakeSize);
      ctx.strokeRect(coordinate.x + 1, coordinate.y + 1, snakeSize - 1, snakeSize - 1);
    });

    const latestKey = this.getPressedKeys().pop();

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

export default Game;