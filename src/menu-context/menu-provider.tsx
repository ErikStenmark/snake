import React from 'react';
import { IEngine } from '../game/engine';
import { useGame } from '../hooks/use-game';
import { MenuContext, menuContextFactory } from './menu-context';

export type MenuProviderProps = React.PropsWithChildren<{
  engine: IEngine;
}>

const MenuProvider: React.FC<MenuProviderProps> = ({ children, engine }) => {
  const menuProps = useGame(engine);
  const contextValue = menuContextFactory(menuProps);

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}

MenuProvider.displayName = 'MenuProvider';
export default MenuProvider;