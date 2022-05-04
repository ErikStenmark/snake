import React from 'react';

import Engine from './game/engine/engine';
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
  game: Engine;
}

const App: React.FC<AppProps> = ({ game }) => {
  const [gameOn, setGameOn] = React.useState(false);
  const data = useGameData(game);

  const isRunning = useGameRunner(gameOn, game);
  const [isPaused, togglePause] = usePause(game, isRunning);

  const context: GameContextProps = {
    data,
    game,
    isRunning,
    isPaused,
    setGameOn,
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
