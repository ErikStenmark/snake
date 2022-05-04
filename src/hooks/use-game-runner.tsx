import React from 'react';
import Engine from '../game/engine/engine';

const useGameRunner = (gameOn: boolean, engine: Engine) => {

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