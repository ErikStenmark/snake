import React from 'react';
import { IEngine } from '../game/engine';

const useGameData = (engine: IEngine) => {
  const [gameData, setGameData] = React.useState<any>();

  React.useEffect(() => {
    engine.setDataCB(setGameData);

    return () => {
      engine.setDataCB(() => {/* noop */ });
    };
  }, [engine]);

  return gameData;

}

export default useGameData;