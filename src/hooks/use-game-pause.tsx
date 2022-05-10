import React from 'react';
import { IEngine } from '../game/engine';

const useGamePause = (engine: IEngine, isRunning: boolean): [boolean, () => void] => {
  const [isPaused, setIsPaused] = React.useState(false);

  const togglePause = () => {
    setIsPaused(engine.pause() as boolean);
  }

  if (!isRunning && !!isPaused) {
    setIsPaused(false);
  }

  return [isPaused, togglePause];
}

export default useGamePause;