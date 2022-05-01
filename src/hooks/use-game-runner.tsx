import React from 'react';
import Main from '../game/main';

const useGameRunner = (gameOn: boolean, game: Main) => {

  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    if (gameOn && !isRunning) {
      setIsRunning(true);
      game.run();
    }

    if (!gameOn && isRunning && !!game) {
      setIsRunning(false);
      game.end();
    }
  }, [gameOn, isRunning, setIsRunning, game]);

  return isRunning;
}

export default useGameRunner;