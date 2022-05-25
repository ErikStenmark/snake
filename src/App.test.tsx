import App from './app';
import { IEngine } from './game/engine/engine';
import { render, screen } from '@testing-library/react';
import { gameTitle } from './components/main-menu';

import MenuProvider from './menu-context/menu-provider';

class MockEngine implements IEngine {
  public run = () => {/** noop */ }
  public end = () => {/** noop */ }
  public pause = () => false;
  public setDataCB = (cb: (...args: any) => void) => {/** noop */ }
  public setOptions = (options: { [key: string]: any; }) => {/** noop */ }
  public setOnGameOver: (cb: () => void) => void;
}

const mockEngine = new MockEngine();

const renderer = () => {
  const wrapper = ({ children }: any) => (
    <MenuProvider engine={mockEngine}>
      {children}
    </MenuProvider>
  );

  return render(<App />, { wrapper });
}

describe('App', () => {
  it('should render the main-menu', () => {
    renderer();
    const mainMenu = screen.getByText(gameTitle, { exact: false });
    expect(mainMenu).toBeInTheDocument();
  });
});
