import React from 'react';

import { IEngine } from './game/engine/engine';
import MainMenu from './components/main-menu';
import Score from './components/score';
import PauseMenu from './components/pause-menu';
import useGameControls from './hooks/use-game-controls';
import useGameData from './hooks/use-game-data';
import useGameRunner from './hooks/use-game-runner';
import usePause from './hooks/use-pause';

import { GameContext, GameContextProps } from '.';
import './style/app.css';

type AppProps = {
  engine: IEngine;
}

const App: React.FC<AppProps> = ({ engine }) => {
  const [engineOn, setEngineOn] = React.useState(false);
  const data = useGameData(engine);

  const isRunning = useGameRunner(engineOn, engine);
  const [isPaused, togglePause] = usePause(engine, isRunning);

  const context: GameContextProps = {
    data,
    engine,
    isRunning,
    isPaused,
    setEngineOn,
    togglePause
  }

  useGameControls(context);

  return (
    <GameContext.Provider value={context}>
      <div className="App">
        <MainMenu />
        <Score />
        <PauseMenu />
      </div >
    </GameContext.Provider>
  );
}

export default App;
