import { createContext, useContext } from 'react';
import Menu, { MenuContextProps } from './menu';

export const defaultMenuContextProps: MenuContextProps = {
  data: null,
  engine: null,
  isPaused: false,
  isRunning: false,
  endScore: undefined,
  setEndScore: () => {/** noop */ },
  setEngineOn: (state: boolean) => {/** noop */ },
  togglePause: () => {/** noop */ }
}

export type MenuContext = {
  getMenu(): Menu;
}

export const createMenu = (props: MenuContextProps): Menu => new Menu(props);

export const menuContextFactory = (props: MenuContextProps) => ({
  getMenu: () => createMenu(props)
});

const gameContext = createContext<MenuContext>(menuContextFactory(defaultMenuContextProps));

export const useMenu = (): MenuContextProps => {
  return useContext(gameContext).getMenu().getProps()
}


export default gameContext;
