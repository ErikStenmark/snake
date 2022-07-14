import React from 'react';
import { IEngine } from '../game/engine';
import { useGame } from '../hooks/use-game';

import { MenuContext, menuContextFactory, MenuContextProps } from '../menu-context';

export type MenuProviderProps = React.PropsWithChildren<{
  engine: IEngine;
}>

export const mockMenuProviderFactory = (menuProps: Partial<MenuContextProps> = {}): React.FC<MenuProviderProps> => {
  return ({ children, engine }) => {
    const defaultMenuProps = useGame(engine);
    const withPassedMenuProps = { ...defaultMenuProps, ...menuProps };
    const contextValue = menuContextFactory(withPassedMenuProps);

    return (
      <MenuContext.Provider value={contextValue}>
        {children}
      </MenuContext.Provider>
    );
  }
}