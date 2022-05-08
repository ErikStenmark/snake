import { createContext, useContext } from 'react';
import Menu, { MenuProps } from './menu';

export const defaultProps: MenuProps = {
  data: null,
  engine: null,
  isPaused: false,
  isRunning: false,
  setEngineOn: (state: boolean) => {/** noop */ },
  togglePause: () => {/** noop */ }
}

export type MenuContext = {
  getMenu(): Menu;
}

export const createMenu = (props: MenuProps): Menu => new Menu(props);

export const menuContextFactory = (props: MenuProps) => ({
  getMenu: () => createMenu(props)
});

const gameContext = createContext<MenuContext>(menuContextFactory(defaultProps));

export const useMenu = (): MenuProps => useContext(gameContext).getMenu().getProps();

export default gameContext;
