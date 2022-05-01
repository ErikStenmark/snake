import React from 'react';
import Main from '../game/main';

const useGameData = (game: Main) => {
  const [gameData, setGameData] = React.useState<any>();

  React.useEffect(() => {
    game.setDataCB(setGameData);

    return () => {
      game.setDataCB(() => { });
    };
  }, [game]);

  return gameData;

}

export default useGameData;