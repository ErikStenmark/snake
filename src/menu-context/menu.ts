import { IEngine } from '../game/engine';

type GameData = { [key: string]: any };

export type MenuContextProps = {
  engine: IEngine;
  data: GameData;
  isRunning: boolean;
  isPaused: boolean;
  endScore: number;
  setEngineOn: (on: boolean) => void;
  setEndScore: (score: number) => void;
  togglePause: () => void;
}

export default class Menu {

  constructor(
    private props: MenuContextProps
  ) { }

  public getProps() {
    return this.props;
  }

}