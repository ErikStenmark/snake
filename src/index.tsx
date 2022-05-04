import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import reportWebVitals from './reportWebVitals';
import Engine from './game/engine/engine';
import './style/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const engine = new Engine();

export type GameContextProps = {
  data: { [key: string]: any }
  engine: Engine,
  isRunning: boolean;
  isPaused: boolean;
  setEngineOn: (on: boolean) => void;
  togglePause: () => void;
}

export const GameContext = createContext<GameContextProps>({
  data: {},
  engine: engine,
  isRunning: false,
  isPaused: false,
  setEngineOn: () => { },
  togglePause: () => { }
});

root.render(
  <React.StrictMode>
    <App engine={engine} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
