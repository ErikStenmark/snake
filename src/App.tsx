import React from 'react';

import MainMenu from './components/main-menu';
import Score from './components/score';
import PauseMenu from './components/pause-menu';

import './style/app.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <MainMenu />
      <Score />
      <PauseMenu />
    </div >
  );
}

export default App;
