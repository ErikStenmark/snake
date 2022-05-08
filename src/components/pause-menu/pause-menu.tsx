import React from 'react';
import { useMenu } from '../../menu-context';
import style from './pause-menu.module.css';

const PauseMenu: React.FC = () => {
  const { isPaused } = useMenu();

  if (!isPaused) {
    return null;
  }

  return (
    <div className={style.root}>{'- pause -'}</div>
  )
}

PauseMenu.displayName = 'PauseMenu';
export default PauseMenu;