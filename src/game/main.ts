import Renderer from './renderer';

export default class Main {
  private renderer: Renderer | null = null;
  private dataCB: () => void = () => { }

  public run() {
    this.renderer = new Renderer();
    this.renderer.setDataCB(this.dataCB);
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

  private isRunning = false;

}