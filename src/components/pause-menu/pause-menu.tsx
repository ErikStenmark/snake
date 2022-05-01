import React, { useContext } from 'react';
import { GameContext } from '../..';
import style from './pause-menu.module.css';

const PauseMenu: React.FC = () => {
  const { isPaused } = useContext(GameContext);

  if (!isPaused) {
    return null;
  }

  return (
    <div className={style.root}>{'- pause -'}</div>
  )
}

PauseMenu.displayName = 'PauseMenu';
export default PauseMenu;