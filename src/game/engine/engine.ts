import Game from '../game';

export default class Engine {
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

  public setOptions(options: any) {
    this.options = options;
    this.game?.setOptions(options);
  }

}