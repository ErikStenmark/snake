import PubSub from './engine/pubsub';
import { Direction } from './game';
import { LevelAttributes, Position } from './level';

export type SnakeDirection = Direction | undefined;

class Snake {
  private snakePos: number[] = [];
  private snakeDir: SnakeDirection = undefined;

  private level: LevelAttributes;
  private isPaused: boolean = false;
  private isFirstRender: boolean = true;
  private foodPosition: number;

  private hasTicked = false;

  constructor(
    private pubSub: PubSub,
    private ctx: CanvasRenderingContext2D,
    private hasWalls: boolean,
    private getPressedKeys: () => string[]
  ) {
    this.pubSub.subscribe('FOOD_ADDED', ({ data }) => this.foodPosition = data);
    this.pubSub.subscribe('LEVEL_RESIZED', ({ data }) => this.level = data);
    this.pubSub.subscribe('PAUSE', ({ data }) => this.isPaused = data);
    this.pubSub.subscribe('FIRST_RENDER_DONE', () => this.isFirstRender = false);
    this.pubSub.subscribe('TICK', () => this.hasTicked = true);
  }

  public draw() {
    if (this.isFirstRender) {
      this.snakePos.push(1);
    }

    this.drawSnake();
    this.setDirection();
    this.moveOnTick();
  }

  public setWalls(setting: boolean) {
    this.hasWalls = setting;
  }

  private drawSnake() {
    const { ctx } = this;
    ctx.strokeStyle = 'black';
    const size = this.level.squareSize;

    this.snakePos.forEach((pos, i) => {
      const coordinate = this.getCoordinateByIndex(pos);
      ctx.fillStyle = i === this.snakePos.length - 1 ? 'lime' : 'darkgreen';
      ctx.fillRect(coordinate.x, coordinate.y, size, size);
      ctx.strokeRect(coordinate.x + 1, coordinate.y + 1, size - 1, size - 1);
    });
  }

  private moveOnTick() {
    if (this.hasTicked) {
      this.hasTicked = false;
      const nextPos = this.getSnakeNextPos(this.snakeDir);
      this.moveTo(nextPos);
    }
  }

  private isFirstBodyInDirection = (direction: Direction) => {
    const firstBodyCoIndex = this.getSnakeFirstBodyCoordinateIndex();
    const nextPosCoordinate = this.getSnakeNextPos(direction);
    const nextPosCoordinateIndex = this.getCoordinateIndex(nextPosCoordinate);
    return nextPosCoordinateIndex === firstBodyCoIndex;
  }

  private setDirection() {
    const { isFirstBodyInDirection } = this;
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
  }

  private moveTo(position: Position) {
    if (!this.isPaused) {
      const warpedPos = this.teleportIfNeeded(position);
      const posIndex = this.getCoordinateIndex(warpedPos);

      if (!this.snakeIncludesCoordinateIndex(posIndex) && this.levelIncludesCoordinateIndex(posIndex)) {
        this.snakePos.push(posIndex);

        if (!this.eat()) {
          this.snakePos.shift();
        }

        this.broadcastPosition();
      }
    }
  }

  private broadcastPosition = () => {
    this.pubSub.broadcast({ topic: 'SNAKE_MOVED', data: this.snakePos });
  }

  private eat = () => {
    const headCoordinateIndex = this.getSneakHeadCoordinateIndex();
    const gotFood = headCoordinateIndex === this.foodPosition;

    if (gotFood) {
      this.pubSub.broadcast({ topic: 'EAT', data: null });
    }

    return gotFood;
  }

  private teleportIfNeeded(position: Position): Position {
    if (this.hasWalls) {
      return position;
    }

    let { x, y } = position;
    const { xStart, xEnd, yStart, yEnd } = this.level.boundaries;
    const headIndex = this.getSneakHeadCoordinateIndex();
    const blockAmount = this.level.blockAmount;

    if (x >= xEnd) {
      const newIndex = this.getCoordinateByIndex(headIndex - ((blockAmount / 4) - 1));
      x = newIndex.x;
    }

    if (x < xStart) {
      const newIndex = this.getCoordinateByIndex(headIndex + ((blockAmount / 4) - 1));
      x = newIndex.x;
    }

    if (y >= yEnd) {
      const rowBlocks = (blockAmount / 4) - 1;
      const newIndex = this.getCoordinateByIndex(headIndex - ((rowBlocks * rowBlocks) + rowBlocks));
      y = newIndex.y;
    }

    if (y < yStart) {
      const rowBlocks = (blockAmount / 4) - 1;
      const newIndex = this.getCoordinateByIndex(headIndex + ((rowBlocks * rowBlocks) + rowBlocks));
      y = newIndex.y;
    }

    return { x, y };
  }

  private getSnakeNextPos(direction: Direction) {
    const headCoordinateIndex = this.getSneakHeadCoordinateIndex();
    const { x: headX, y: headY } = this.getCoordinateByIndex(headCoordinateIndex);
    const nextPos = { x: headX, y: headY };

    const movementAmount = this.level.squareSize;

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

  private snakeIncludesCoordinateIndex(index: number) {
    return this.snakePos.slice(1, this.snakePos.length - 1).includes(index);
  }

  private getSneakHeadCoordinateIndex() {
    return this.snakePos[this.snakePos.length - 1];
  }

  private getSnakeFirstBodyCoordinateIndex() {
    return this.snakePos.length > 1 ? this.snakePos[this.snakePos.length - 2] : null;
  }

  private getCoordinateIndex(position: Position) {
    return this.level.coordinates.findIndex(c => c.x === position.x && c.y === position.y);
  }

  private getCoordinateByIndex(index: number) {
    return this.level.coordinates[index];
  }

  private levelIncludesCoordinateIndex(index: number) {
    return !!this.level.coordinates[index];
  }
}

export default Snake;