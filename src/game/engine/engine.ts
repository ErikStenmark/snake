import Game from '../game';

export interface IEngine {
  run: () => void;
  end: () => void;
  pause: () => boolean;
  setOnGameOver: (cb: (...args: any) => void) => void;
  setDataCB: (cb: (...args: any) => void) => void;
  setOptions: (options: { [key: string]: any }) => void;
}

export default class Engine implements IEngine {
  private game: Game | null = null;
  private options: any = {};
  private isRunning = false;
  private dataCB: () => void = () => { /** noop */ };
  private gameOverCB: () => void = () => { /** noop */ };

  public run() {
    this.game = new Game();
    this.isRunning = true;
    this.game.setDataCB(this.dataCB);
    this.game.setOptions(this.options);
    this.game.setOnGameOver(this.gameOverCB);

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

  public setOnGameOver(cb: () => void) {
    this.gameOverCB = cb;
    this.game?.setOnGameOver(this.gameOverCB);
  }

}