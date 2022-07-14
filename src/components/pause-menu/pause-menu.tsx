import React from 'react';
import { useMenu } from '../../menu-context';
import style from './pause-menu.module.css';

export const pauseMenuText = '- pause -';

const PauseMenu: React.FC = () => {
  const { isPaused } = useMenu();

  if (!isPaused) {
    return null;
  }

  return (
    <div className={style.root}>{pauseMenuText}</div>
  )
}

PauseMenu.displayName = 'PauseMenu';
export default PauseMenu;