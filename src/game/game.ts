
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
import Logger from './logger';

export type Direction = 'l' | 'r' | 'u' | 'd';

class Game extends Renderer {
  private level: Level;
  private food: Food;
  private snake: Snake;
  private logger: Logger;

  private score = 0;

  private tickRate = 20;
  private elapsedDelta = 0;
  private options: GameOptions = defaultGameOpts;

  public setOptions(options: any) {
    this.options = options;
  }

  constructor() {
    super();

    const ctx = this.getCtx();

    this.level = new Level(
      this.pubSub,
      ctx,
      this.getScreenSize()
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

    this.logger = new Logger(
      this.pubSub,
      ctx,
      this.options.fps === 'on'
    );

    this.pubSub.subscribe('EAT', () => {
      this.score = this.score + 1;
      this.dataCB({ score: this.score });
    });
  }

  public onUpdate() {
    if (this.getIsFirstRender()) {
      this.applyOptions();
      this.dataCB({ score: this.score });
    }

    this.logger.draw();

    this.tick();
    this.level.drawLevel();
    this.level.drawGrid();
    this.snake.draw();
    this.food.draw();
  }

  private tick = () => {
    const delta = this.getDelta();
    if (this.elapsedDelta >= this.tickRate) {
      this.elapsedDelta = 0;
      this.pubSub.broadcast({ topic: 'TICK', data: null });
    }

    this.elapsedDelta += delta;
  }

  private applyOptions() {
    const sizeMap: { [key in GameOptSize]: number } = {
      large: 1,
      medium: 2,
      small: 4
    }

    const speedMap: { [key in GameOptSpeed]: number } = {
      fast: 1,
      medium: 3,
      slow: 6
    }

    this.level.setBlockAmount(this.level.getBlockAmount() / sizeMap[this.options.size]);
    this.tickRate = this.tickRate * speedMap[this.options.speed];
    this.snake.setWalls(this.options.walls === 'on');
    this.logger.setDisplaying(this.options.fps === 'on');
  }

}

export default Game;