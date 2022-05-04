import React from 'react';
import Engine from '../game/engine/engine';

const useGameData = (engine: Engine) => {
  const [gameData, setGameData] = React.useState<any>();

  React.useEffect(() => {
    engine.setDataCB(setGameData);

    return () => {
      engine.setDataCB(() => { });
    };
  }, [engine]);

  return gameData;

}

export default useGameData;