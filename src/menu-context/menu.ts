import { IEngine } from '../game/engine';

type GameData = { [key: string]: any };

export type EngineOnFn = (on: boolean) => void;
export type TogglePauseFn = () => void;

export type MenuContextProps = {
  engine: IEngine;
  data: GameData;
  isRunning: boolean;
  isPaused: boolean;
  setEngineOn: (on: boolean) => void;
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