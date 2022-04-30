import React from 'react';
import Main from './game/main';
import MainMenu from './components/main-menu';
import { GameContext } from '.';
import Score from './components/score';
import PauseMenu from './components/pause-menu';
import './style/app.css';

type AppProps = {
  main: Main;
}

const App: React.FC<AppProps> = ({ main }) => {

  const [gameOn, setGameOn] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [gameData, setGameData] = React.useState<any>({});

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'p' && gameOn) {
        setPaused(main.pause() as boolean);
      }

      if (e.key === 'Escape' && gameOn) {
        setGameOn(false);
      }
    }

    main.setDataCB(setGameData);
    window.addEventListener('keydown', keyListener);

    return () => {
      main.setDataCB(() => { });
      window.removeEventListener('keydown', keyListener)
    };

  }, [main, gameOn]);

  React.useEffect(() => {
    if (gameOn && !running) {
      setRunning(true);
      main.run();
    }

    if (!gameOn && running && !!main) {
      setRunning(false);
      setPaused(false);
      main.end();
    }

  }, [gameOn, running, main]);

  return (
    <GameContext.Provider value={{ data: gameData, game: main, setGameOn }}>
      <div className="App">
        {!gameOn && <MainMenu />}
        {gameOn && <Score />}
        {paused && <PauseMenu />}
      </div >
    </GameContext.Provider>
  );
}

export default App;
