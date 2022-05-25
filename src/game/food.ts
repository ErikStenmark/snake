import PubSub from './engine/pubsub';
import { EventPayloadType } from './events';
import { LevelAttributes } from './level';

class Food {

  private resetPosition = -1;
  private position: number = this.resetPosition;

  private level: LevelAttributes;
  private snakePositions: number[] = [];

  constructor(
    private pubSub: PubSub,
    private ctx: CanvasRenderingContext2D
  ) {
    this.pubSub.subscribe('LEVEL_RESIZED', this.onLevelRender);
    this.pubSub.subscribe('SNAKE_MOVED', this.onSnakeMoved);
    this.pubSub.subscribe('EAT', () => this.position = this.resetPosition);
  }

  public draw() {
    const { ctx } = this;
    const coordinates = this.level?.coordinates;

    if (!coordinates) {
      return;
    }

    if (this.needsNewFood()) {
      this.getNewPosition();
    }

    ctx.fillStyle = 'red';
    if (this.position >= 0) {
      const coordinate = this.level.coordinates[this.position];
      ctx.fillRect(
        coordinate.x,
        coordinate.y,
        this.level.squareSize,
        this.level.squareSize
      );
    }
  }

  private getNewPosition() {
    let position;

    const firstRandomCoordinatePosition = this.randomIntFromRange(0, this.level.coordinates.length - 1);
    position = firstRandomCoordinatePosition;

    while (this.snakeIncludesPosition(position)) {
      position += 1

      if (position > this.level.coordinates.length - 1) {
        position = 0;
      }

      if (position === firstRandomCoordinatePosition) {
        position = this.resetPosition;
      }
    }

    this.position = position;
    this.broadcastPosition();
  }

  private onLevelRender = ({ data }: EventPayloadType<'LEVEL_RESIZED'>) => {
    this.level = data;
  }

  private onSnakeMoved = ({ data }: EventPayloadType<'SNAKE_MOVED'>) => {
    this.snakePositions = data;
  }

  private snakeIncludesPosition = (index: number) => {
    return this.snakePositions.includes(index);
  }

  private needsNewFood() {
    return this.position === this.resetPosition && this.level.coordinates.length;
  }

  private randomIntFromRange(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private broadcastPosition() {
    this.pubSub.broadcast({
      topic: 'FOOD_ADDED',
      data: this.position
    });
  }

}

export default Food;