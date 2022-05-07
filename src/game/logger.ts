import PubSub from './engine/pubsub';
import { TimeAttributes } from './engine/renderer';
import { LevelAttributes } from './level';

class Logger {

  private level: LevelAttributes;
  private time: TimeAttributes;

  constructor(
    private pubSub: PubSub,
    private ctx: CanvasRenderingContext2D,
    private displayLog: boolean
  ) {
    this.pubSub.subscribe('LEVEL_RESIZED', ({ data }) => this.level = data);
    this.pubSub.subscribe('NEW_FRAME', ({ data }) => this.time = data);
  }

  public setDisplaying(opt: boolean) {
    this.displayLog = opt;
  }

  public draw() {
    if (!this.level || !this.time) {
      return;
    }

    if (this.displayLog) {
      this.displayFPS();
    }
  }

  private displayFPS() {
    const { ctx } = this;
    this.setFont();
    ctx.textAlign = 'right';
    const { down } = this.getTextRowHeight();

    const text = `fps: ${this.time.avgFps} delta: ${this.time.avgDelta}`;
    ctx.fillText(text, this.level.boundaries.xEnd, down);
  }

  private getFontSize() {
    const smallerSide = window.innerWidth <= window.innerHeight
      ? window.innerWidth
      : window.innerHeight;

    const windowBased = smallerSide / 25;
    const min = 10;

    return windowBased > min ? windowBased : min;
  }

  private getTextRowHeight() {
    return {
      up: this.getFontSize() * 2,
      down: this.level.boundaries.yEnd + this.getFontSize() * 2
    }
  }

  private getFont() {
    return `${this.getFontSize()}px arial`;
  }

  private setFont() {
    const { ctx } = this;
    ctx.fillStyle = 'white';
    ctx.font = this.getFont();
  }

}

export default Logger;