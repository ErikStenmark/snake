import React from 'react';
import Engine from '../game/engine/engine';

const usePause = (engine: Engine, isRunning: boolean): [boolean, () => void] => {
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