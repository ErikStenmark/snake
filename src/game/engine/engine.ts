import Game from '../game';

export interface IEngine {
  run: () => void;
  end: () => void;
  pause: () => boolean;
  setDataCB: (cb: (...args: any) => void) => void;
  setOptions: (options: { [key: string]: any }) => void;
}

export default class Engine implements IEngine {
  private game: Game | null = null;
  private dataCB: () => void = () => { };
  private options: any = {};
  private isRunning = false;

  public run() {
    this.game = new Game();
    this.game.setDataCB(this.dataCB);
    this.game.setOptions(this.options);
    this.isRunning = true;

    const loop = () => window.requestAnimationFrame(gameLoop);

    const gameLoop = () => {
      this.game?.update();

      if (this.isRunning) {
        loop();
      }
    }

    loop();
  }

  public end() {
    this.game?.endGame();
    this.isRunning = false;
    this.game = null;
  }

  public pause() {
    return this.game?.togglePause();
  }

  public setDataCB(cb: (...args: any) => void) {
    this.dataCB = cb;
    return this.game?.setDataCB(this.dataCB);
  }

  public setOptions(options: { [key: string]: any }) {
    this.options = options;
    this.game?.setOptions(options);
  }

}