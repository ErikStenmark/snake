
import Renderer from './engine/renderer';

import {
  defaultGameOpts,
  GameOptions,
  GameOptSize,
  GameOptSpeed
} from '../components/main-menu';

import Level from './level';
import Food from './food';
import Snake from './snake';

export type Direction = 'l' | 'r' | 'u' | 'd';

class Game extends Renderer {
  private level: Level;
  private food: Food;
  private snake: Snake;

  private score: number = 0;

  private tickRate = 20;
  private elapsedDelta: number = 0;
  private options: GameOptions = defaultGameOpts;

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

    this.snake = new Snake(
      this.pubSub,
      ctx,
      this.options.walls === 'on',
      this.getPressedKeys
    )

    this.food = new Food(
      this.pubSub,
      ctx
    );

    this.pubSub.subscribe('EAT', () => {
      this.score = this.score + 1;
      this.dataCB({ score: this.score });
    });
  }

  public onUpdate() {
    if (this.getIsFirstRender()) {
      this.getOptions();
      this.dataCB({ score: this.score });
    }

    if (this.options.fps === 'on') {
      this.displayFPS();
    }

    this.tick();
    this.level.drawPlayField();
    this.level.drawCoordinates();
    this.snake.draw();
    this.food.draw();
  }

  private tick = () => {
    const delta = this.getDelta();
    if (this.elapsedDelta >= this.tickRate) {
      this.elapsedDelta = 0;
      this.pubSub.broadcast({ topic: 'TICK', data: null });
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

    this.snake.setWalls(this.options.walls === 'on');
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

}

export default Game;