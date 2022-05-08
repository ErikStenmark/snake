import App from './app';
import { IEngine } from './game/engine/engine';
import { render, screen } from '@testing-library/react';
import MenuProvider from './menu-context/menu-provider';
import { gameTitle } from './components/main-menu';

class MockEngine implements IEngine {
  public run = () => {/** noop */ }
  public end = () => {/** noop */ }
  public pause = () => false;
  public setDataCB = (cb: (...args: any) => void) => {/** noop */ }
  public setOptions = (options: { [key: string]: any; }) => {/** noop */ }
}

test('renders the menu', () => {
  render(
    <MenuProvider engine={new MockEngine()}>
      <App />
    </MenuProvider>
  );
  const mainMenu = screen.getByText(gameTitle);
  expect(mainMenu).toBeInTheDocument();
});
