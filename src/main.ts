import Renderer from './renderer';

class Main {

  private renderer: Renderer;

  constructor() {
    this.renderer = new Renderer();
  }

  public run() {
    const loop = () => {
      window.requestAnimationFrame(gameLoop);
    }

    const gameLoop = () => {
      this.renderer.onUpdate();
      loop();
    }

    loop();
  }

}

(() => {
  const main = new Main();
  main.run();
})()