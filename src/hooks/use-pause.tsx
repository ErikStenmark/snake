import React from 'react';
import { IEngine } from '../game/engine';

const usePause = (engine: IEngine, isRunning: boolean): [boolean, () => void] => {
  const [isPaused, setIsPaused] = React.useState(false);

  const togglePause = () => {
    setIsPaused(engine.pause() as boolean);
  }

  if (!isRunning && !!isPaused) {
    setIsPaused(false);
  }

  return [isPaused, togglePause];
}

export default usePause;