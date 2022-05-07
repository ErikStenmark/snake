import PubSub from './engine/pubsub';
import { EventPayloadType } from './events';
import { LevelAttributes } from './level';

class Food {

  private resetPosition: number = -1;
  private position: number = this.resetPosition;

  private level: LevelAttributes;
  private snakePositions: number[] = [];

  constructor(
    private pubSub: PubSub,
    private ctx: CanvasRenderingContext2D
  ) {
    this.pubSub.subscribe('LEVEL_RESIZED', this.onLevelRender);
    this.pubSub.subscribe('SNAKE_MOVED', this.onSnakeMoved);
  }

  public draw() {
    let { position } = this;
    const { ctx } = this;

    const coordinates = this.level?.coordinates;

    if (!coordinates) {
      return;
    }

    let firstRandomCoordinatePosition = 0;

    if (this.needsNewFood()) {
      firstRandomCoordinatePosition = this.randomIntFromRange(0, coordinates.length - 1);
      position = firstRandomCoordinatePosition;

      while (this.snakeIncludesPosition(position)) {
        position += 1

        if (position > coordinates.length - 1) {
          position = 0;
        }

        if (position === firstRandomCoordinatePosition) {
          position = this.resetPosition;
        }
      }

      this.position = position;
      this.broadcastPosition();
    }


    if (this.snakeIncludesPosition(this.position)) {
      this.position = coordinates.findIndex((c, i) => !this.snakePositions.includes(i)) || this.resetPosition;
    }

    ctx.fillStyle = 'red';
    if (this.position >= 0) {
      const coordinate = this.level.coordinates[position];
      ctx.fillRect(
        coordinate.x,
        coordinate.y,
        this.level.squareSize,
        this.level.squareSize
      );
    }
  }

  public remove() {
    this.position = this.resetPosition;
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
  };

}

export default Food;