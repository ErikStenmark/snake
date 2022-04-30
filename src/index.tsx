import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import reportWebVitals from './reportWebVitals';
import Main from './game/main';
import './style/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const main = new Main();

type GameContextProps = {
  data: { [key: string]: any }
  game: Main,
  setGameOn: (on: boolean) => void;
}

export const GameContext = createContext<GameContextProps>({
  data: {},
  game: main,
  setGameOn: () => { }
});

root.render(
  <React.StrictMode>
    <App main={main} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
