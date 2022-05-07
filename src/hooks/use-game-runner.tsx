import React from 'react';
import { IEngine } from '../game/engine/engine';

const useGameRunner = (gameOn: boolean, engine: IEngine) => {

  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    if (gameOn && !isRunning) {
      setIsRunning(true);
      engine.run();
    }

    if (!gameOn && isRunning && !!engine) {
      setIsRunning(false);
      engine.end();
    }
  }, [gameOn, isRunning, setIsRunning, engine]);

  return isRunning;
}

export default useGameRunner;