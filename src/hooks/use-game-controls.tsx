import React from 'react';
import { GameContextProps } from '..';

const useGameControls = (props: GameContextProps) => {
  const { setGameOn, togglePause, isRunning, isPaused } = props;

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      e.preventDefault();

      if (isPaused || (e.key === 'p' && isRunning)) {
        togglePause();
      }

      if (e.key === 'Escape' && isRunning) {
        setGameOn(false);
      }
    }

    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener)
    };

  }, [isRunning, isPaused, setGameOn, togglePause]);
}

export default useGameControls;