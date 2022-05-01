import React from 'react';
import { GameContextProps } from '..';

const useGameControls = (props: GameContextProps) => {
  const { setGameOn, togglePause, isRunning } = props;

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === 'p' && isRunning) {
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

  }, [isRunning, setGameOn, togglePause]);
}

export default useGameControls;