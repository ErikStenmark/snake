import React from 'react';

import MainMenu from './components/main-menu';
import Score from './components/score';
import PauseMenu from './components/pause-menu';

import './style/app.css';
import { useMenu } from './menu-context';
import GameOverMenu from './components/game-over-menu';

const App: React.FC = () => {
  const { endScore } = useMenu();

  const main = (
    <>
      <MainMenu />
      <Score />
      <PauseMenu />
    </>
  );

  const gameOver = <GameOverMenu score={endScore} />

  return (
    <div className="App">
      {!isNaN(endScore) ? gameOver : main}
    </div >
  );
}

export default App;
