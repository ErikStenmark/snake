import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import reportWebVitals from './reportWebVitals';
import Engine from './game/engine/engine';
import './style/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const main = new Engine();

export type GameContextProps = {
  data: { [key: string]: any }
  game: Engine,
  isRunning: boolean;
  isPaused: boolean;
  setGameOn: (on: boolean) => void;
  togglePause: () => void;
}

export const GameContext = createContext<GameContextProps>({
  data: {},
  game: main,
  isRunning: false,
  isPaused: false,
  setGameOn: () => { },
  togglePause: () => { }
});

root.render(
  <React.StrictMode>
    <App game={main} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
