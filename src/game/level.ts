import PubSub from './engine/pubsub';
import { ScreenSize } from './engine/renderer';
import { EventPayloadType } from './events';

export type Position = { x: number; y: number };

export type Boundaries = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
}

export type LevelAttributes = {
  width: number;
  boundaries: Boundaries;
  coordinates: Position[];
  blockSize: number;
}

class Level {
  private width = 0;
  private boundaries: Boundaries = { xStart: 0, xEnd: 0, yStart: 0, yEnd: 0 }
  private coordinates: Position[] = [];

  private blockAmount = 128;
  private blockSize = 0;
  private squareFactor = 4;

  constructor(
    private pubSub: PubSub,
    private screenSize: ScreenSize,
    private ctx: CanvasRenderingContext2D
  ) {
    this.pubSub.subscribe('SCREEN_RESIZED', this.onResize);
    this.calculatePlayArea();
    this.calculateCoordinates();
    this.broadcastLevel();
  }

  public drawPlayField() {
    const { ctx } = this
    const lineWidth = 1;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    ctx.strokeRect(
      this.boundaries.xStart - lineWidth,
      this.boundaries.yStart - lineWidth,
      this.width + lineWidth + 1,
      this.width + lineWidth + 1
    );
  }

  public drawCoordinates() {
    const { ctx } = this;
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;

    this.coordinates.forEach(pos => {
      ctx.strokeRect(pos.x + 1, pos.y + 1, this.getSquareSize() - 2, this.getSquareSize() - 2);
    })
  }

  public getBlockAmount() {
    return this.blockAmount;
  }

  public setBlockAmount(amount: number) {
    this.blockAmount = amount;
  }

  public getBoundaries() {
    return this.boundaries;
  }

  public getCoordinates() {
    return this.coordinates;
  }

  public getCoordinateIndex = (position: Position) => {
    return this.coordinates.findIndex(c => c.x === position.x && c.y === position.y);
  }

  public getCoordinateByIndex = (index: number) => {
    return this.coordinates[index];
  }

  public playFieldIncludesCoordinateIndex(index: number) {
    return !!this.coordinates[index];
  }

  public getSmallerWindowSide() {
    const { height, width } = this.screenSize;
    return width <= height ? width : height;
  }

  public getSquareSize() {
    return this.squareFactor * this.blockSize;
  }

  private calculatePlayArea = () => {
    const { width, height } = this.screenSize;
    const windowSmallerSide = this.getSmallerWindowSide();
    const windowSideLength = Math.floor(windowSmallerSide);
    const margin = Math.floor(25 + windowSmallerSide * 0.1);

    this.width = Math.round(windowSideLength - margin * 2);
    this.blockSize = this.width / this.blockAmount;

    this.boundaries.xStart = (width - windowSideLength) / 2 + margin;
    this.boundaries.yStart = (height - windowSideLength) / 2 + margin;
    this.boundaries.xEnd = this.boundaries.xStart + this.width;
    this.boundaries.yEnd = this.boundaries.yStart + this.width;
  }

  private calculateCoordinates() {
    const coordinates: Position[] = [];

    let y = this.boundaries.yStart;

    while (y < this.boundaries.yEnd) {
      let x = this.boundaries.xStart;

      while (x < this.boundaries.xEnd) {
        coordinates.push({ x, y });
        x += this.getSquareSize();
      }

      y += this.getSquareSize();
    }

    this.coordinates = coordinates;
  }

  private broadcastLevel() {
    this.pubSub.broadcast({
      topic: 'LEVEL_RESIZED',
      data: {
        blockSize: this.blockSize,
        boundaries: this.boundaries,
        coordinates: this.coordinates,
        width: this.width
      }
    });
  }

  private onResize = (e: EventPayloadType<'SCREEN_RESIZED'>) => {
    this.screenSize = e.data;
    this.calculatePlayArea();
    this.calculateCoordinates();

    this.broadcastLevel();
  }

}

export default Level;