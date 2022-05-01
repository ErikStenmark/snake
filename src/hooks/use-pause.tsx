import React from 'react';
import Main from '../game/main';

const usePause = (game: Main, isRunning: boolean): [boolean, () => void] => {
  const [isPaused, setIsPaused] = React.useState(false);

  const togglePause = () => {
    setIsPaused(game.pause() as boolean);
  }

  if (!isRunning && !!isPaused) {
    setIsPaused(false);
  }

  return [isPaused, togglePause];
}

export default usePause;