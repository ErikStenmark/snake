import React from 'react';
import { GameContext } from '../..';
import Menu, { MenuItem } from '../menu';

const MainMenu: React.FC = () => {
  const { setGameOn, isRunning } = React.useContext(GameContext);
  const startGame = () => setGameOn(true);

  if (isRunning) {
    return null;
  }

  const openOptions = () => {
    console.log('open options');
  }

  const menuItems: MenuItem[] = [
    { name: 'play', action: startGame },
    { name: 'options', action: openOptions }
  ];

  return <Menu items={menuItems} />

}

MainMenu.displayName = 'MainMenu';
export default MainMenu;