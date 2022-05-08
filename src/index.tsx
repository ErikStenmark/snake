import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './app';
import Engine from './game/engine/engine';
import MenuProvider from './menu-context/menu-provider';
import './style/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const engine = new Engine();

root.render(
  <React.StrictMode>
    <MenuProvider engine={engine}>
      <App />
    </MenuProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
