import Renderer from './renderer';

export default class Main {
  private renderer: Renderer | null = null;
  private dataCB: () => void = () => { };
  private options: any = {};

  public run() {
    this.renderer = new Renderer();
    this.renderer.setDataCB(this.dataCB);
    this.renderer.setOptions(this.options);
    this.isRunning = true;

    const loop = () => window.requestAnimationFrame(gameLoop);

    const gameLoop = () => {
      this.renderer?.onUpdate();

      if (this.isRunning) {
        loop();
      }
    }

    loop();
  }

  public end() {
    this.renderer?.endGame();
    this.isRunning = false;
    this.renderer = null;
  }

  public pause() {
    return this.renderer?.pause();
  }

  public setDataCB(cb: (...args: any) => void) {
    this.dataCB = cb;
    return this.renderer?.setDataCB(this.dataCB);
  }

  public setOptions(options: any) {
    this.options = options;
    this.renderer?.setOptions(options);
  }

  private isRunning = false;

}