import React from 'react';
import style from './pause-menu.module.css';

const PauseMenu: React.FC = () => {
  return (
    <div className={style.root}>{'- pause -'}</div>
  )
}

PauseMenu.displayName = 'PauseMenu';
export default PauseMenu;