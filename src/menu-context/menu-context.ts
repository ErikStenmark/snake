import { createContext, useContext } from 'react';
import Menu, { MenuContextProps } from './menu';

export const defaultMenuContextProps: MenuContextProps = {
  data: null,
  engine: null,
  isPaused: false,
  isRunning: false,
  endScore: undefined,
  setEndScore: () => {/** noop */ },
  setEngineOn: () => {/** noop */ },
  togglePause: () => {/** noop */ }
}

export type MenuContext = {
  getMenu(): Menu;
}

export const createMenu = (props: MenuContextProps): Menu => new Menu(props);

export const menuContextFactory = (props: MenuContextProps) => ({
  getMenu: () => createMenu(props)
});


export const useMenu = (): MenuContextProps => {
  return useContext(MenuContext).getMenu().getProps()
}

export const MenuContext = createContext<MenuContext>(menuContextFactory(defaultMenuContextProps));