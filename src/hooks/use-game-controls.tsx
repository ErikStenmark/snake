import React from 'react';
import { MenuContextProps } from '../menu-context';

const useGameControls = (props: MenuContextProps) => {
  React.useEffect(() => {
    if (!props) {
      return;
    }

    const { isPaused, isRunning, setEngineOn, togglePause } = props;

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

  }, [props]);
}

export default useGameControls;