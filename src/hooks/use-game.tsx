import React from 'react';
import { IEngine } from '../game/engine';
import { MenuContextProps } from '../menu-context';
import useGameData from './use-game-data';
import useGameRunner from './use-game-runner';
import useGamePause from './use-game-pause';
import useGameControls from './use-game-controls';

export const useGame = (engine: IEngine): MenuContextProps => {
  const [engineOn, setEngineOn] = React.useState(false);
  const data = useGameData(engine);
  const isRunning = useGameRunner(engineOn, engine);
  const [isPaused, togglePause] = useGamePause(engine, isRunning);
  const [endScore, setEndScore] = React.useState<number>(undefined);

  engine.setOnGameOver((score) => {
    setEndScore(score);
    setEngineOn(false);
  });

  const props: MenuContextProps = {
    data,
    engine,
    isPaused,
    isRunning,
    endScore,
    setEndScore,
    setEngineOn,
    togglePause
  }

  useGameControls(props);

  return props;
}