import React from 'react';
import Main from './game/main';
import './App.css';
import classNames from 'classnames';

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
      if (e.key === 'p' && gameOn) {
        setPaused(main.pause() as boolean);
      }
    }

    main.setDataCB(setGameData);
    window.addEventListener('keypress', keyListener);

    return () => {
      main.setDataCB(() => { });
      window.removeEventListener('keypress', keyListener)
    };

  }, [main, gameOn]);

  React.useEffect(() => {
    if (gameOn && !running) {
      setRunning(true);
      main.run();
    }

    if (!gameOn && running && !!main) {
      setRunning(false);
      main.end();
    }

  }, [gameOn, running, main]);

  const headerClass = classNames('App-header', {
    ['center']: !gameOn
  })

  return (
    <div className="App">
      <header className={headerClass}>
        <button onClick={() => setGameOn(!gameOn)}>{gameOn ? 'end' : 'play'}</button>
        {gameOn &&
          <button onClick={() => setPaused(main.pause() as boolean)}>{paused ? 'continue' : 'pause'}</button>
        }
        {gameOn &&
          <p> {`score: ${!!gameData?.score ? gameData?.score : 0}`}</p>
        }
      </header>
    </div >
  );
}

export default App;
