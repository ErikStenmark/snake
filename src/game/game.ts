
import Renderer from './engine/renderer';

import {
  defaultGameOpts,
  GameOptions,
  GameOptSize,
  GameOptSpeed
} from '../components/main-menu';
import Level, { Position } from './level';
import Food from './food';
import { EventPayloadType } from './events';

type Direction = 'l' | 'r' | 'u' | 'd';
type SnakeDirection = Direction | undefined;

class Game extends Renderer {
  private level: Level;
  private food: Food;

  private tickRate = 20;
  private elapsedDelta: number = 0;
  private options: GameOptions = defaultGameOpts;

  private snakePos: number[] = [];
  private snakeDir: SnakeDirection = undefined;

  private foodPosition: number;

  public setOptions(options: any) {
    this.options = options;
  }

  constructor() {
    super();

    const ctx = this.getCtx();

    this.level = new Level(
      this.pubSub,
      this.getScreenSize(),
      ctx
    );

    this.food = new Food(
      this.pubSub,
      ctx
    );

    this.pubSub.subscribe('FOOD_ADDED', this.onFoodAdded);
  }

  private onFoodAdded = ({ data }: EventPayloadType<'FOOD_ADDED'>) => {
    this.foodPosition = data;
  }

  public onUpdate() {
    if (this.getIsFirstRender()) {
      this.getOptions();
      this.dataCB({ score: !!this.snakePos.length ? this.snakePos.length - 1 : 0 });
    }

    if (this.options.fps === 'on') {
      this.displayFPS();
    }

    this.tick();
    this.level.drawPlayField();
    this.level.drawCoordinates();
    this.snake();
    this.food.draw();
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
    this.level.setBlockAmount(this.level.getBlockAmount() / sizeMap[this.options.size]);

    const speedMap: { [key in GameOptSpeed]: number } = {
      fast: 1,
      medium: 3,
      slow: 6
    }
    this.tickRate = this.tickRate * speedMap[this.options.speed];
  }

  private getFontSize() {
    const smallerSide = this.level.getSmallerWindowSide();
    const windowBased = smallerSide / 25;
    const min = 10;

    return windowBased > min ? windowBased : min;
  }

  private getTextRowHeight() {
    return {
      up: this.getFontSize() * 2,
      down: this.level.getBoundaries().yEnd + this.getFontSize() * 2
    }
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
    ctx.fillText(text, this.level.getBoundaries().xEnd, down);
  }

  private getSneakHeadCoordinateIndex() {
    return this.snakePos[this.snakePos.length - 1];
  }

  private getSnakeFirstBodyCoordinateIndex() {
    return this.snakePos.length > 1 ? this.snakePos[this.snakePos.length - 2] : null;
  }

  private eat() {
    const headCoordinateIndex = this.getSneakHeadCoordinateIndex();
    const gotFood = headCoordinateIndex === this.foodPosition;

    if (gotFood) {
      this.dataCB({ score: this.snakePos.length - 1 });
      this.food.remove();
    }

    return gotFood;
  }

  private snakeIncludesCoordinateIndex(index: number) {
    return this.snakePos.slice(1, this.snakePos.length - 1).includes(index);
  }

  private getSnakeNextPos(direction: Direction) {
    const headCoordinateIndex = this.getSneakHeadCoordinateIndex();
    const { x: headX, y: headY } = this.level.getCoordinateByIndex(headCoordinateIndex);
    const nextPos = { x: headX, y: headY };

    const movementAmount = this.level.getSquareSize();

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
    const { xStart, xEnd, yStart, yEnd } = this.level.getBoundaries();
    const headIndex = this.getSneakHeadCoordinateIndex();
    const blockAmount = this.level.getBlockAmount();

    if (x >= xEnd) {
      const newIndex = this.level.getCoordinateByIndex(headIndex - ((blockAmount / 4) - 1));
      x = newIndex.x;
    }

    if (x < xStart) {
      const newIndex = this.level.getCoordinateByIndex(headIndex + ((blockAmount / 4) - 1));
      x = newIndex.x;
    }

    if (y >= yEnd) {
      const rowBlocks = (blockAmount / 4) - 1;
      const newIndex = this.level.getCoordinateByIndex(headIndex - ((rowBlocks * rowBlocks) + rowBlocks));
      y = newIndex.y;
    }

    if (y < yStart) {
      const rowBlocks = (blockAmount / 4) - 1;
      const newIndex = this.level.getCoordinateByIndex(headIndex + ((rowBlocks * rowBlocks) + rowBlocks));
      y = newIndex.y;
    }

    return { x, y };
  }

  private snake() {
    const snakeSize = this.level.getSquareSize();

    const moveTo = (position: Position) => {
      if (!this.getIsPaused()) {
        const warpedPos = this.teleportIfNeeded(position);
        const posIndex = this.level.getCoordinateIndex(warpedPos);

        if (!this.snakeIncludesCoordinateIndex(posIndex) && this.level.playFieldIncludesCoordinateIndex(posIndex)) {
          this.snakePos.push(posIndex);

          if (!this.eat()) {
            this.snakePos.shift();
          }

          this.pubSub.broadcast({ topic: 'SNAKE_MOVED', data: this.snakePos });
        }
      }
    }

    const isFirstBodyInDirection = (direction: Direction) => {
      const firstBodyCoIndex = this.getSnakeFirstBodyCoordinateIndex();
      const nextPosCoordinate = this.getSnakeNextPos(direction);
      const nextPosCoordinateIndex = this.level.getCoordinateIndex(nextPosCoordinate);
      return nextPosCoordinateIndex === firstBodyCoIndex;
    }

    if (this.getIsFirstRender()) {
      this.snakePos.push(1);
    }

    this.snakePos.forEach((pos, i) => {
      const ctx = this.getCtx();
      ctx.fillStyle = i === this.snakePos.length - 1 ? 'lime' : 'darkgreen';
      ctx.strokeStyle = 'black';
      const coordinate = this.level.getCoordinateByIndex(pos);
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