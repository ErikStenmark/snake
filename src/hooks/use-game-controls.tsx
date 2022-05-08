import React from 'react';
import { useMenu } from '../menu-context';

const useGameControls = () => {
  const {
    setEngineOn,
    togglePause,
    isRunning,
    isPaused
  } = useMenu();

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