import { IEngine } from '../game/engine/engine';

type GameData = { [key: string]: any };

export type MenuProps = {
  engine: IEngine;
  data: GameData;
  isRunning: boolean;
  isPaused: boolean;
  setEngineOn: (on: boolean) => void;
  togglePause: () => void;
}

export default class Menu {

  constructor(
    private props: MenuProps
  ) { }

  public getProps() {
    return this.props;
  }

}