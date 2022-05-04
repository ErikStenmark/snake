import React from 'react';
import { GameContextProps } from '..';

const useGameControls = (props: GameContextProps) => {
  const { setEngineOn, togglePause, isRunning, isPaused } = props;

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      e.preventDefault();

      if (isPaused || (e.key === 'p' && isRunning)) {
        togglePause();
      }

      if (e.key === 'Escape' && isRunning) {
        setEngineOn(false);
      }
    }

    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener)
    };

  }, [isRunning, isPaused, setEngineOn, togglePause]);
}

export default useGameControls;