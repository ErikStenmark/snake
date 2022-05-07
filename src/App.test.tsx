import App from './app';
import { IEngine } from './game/engine/engine';
import { render, screen } from '@testing-library/react';

class MockEngine implements IEngine {
  public run = () => {/** noop */ }
  public end = () => {/** noop */ }
  public pause = () => false;
  public setDataCB = (cb: (...args: any) => void) => {/** noop */ }
  public setOptions = (options: { [key: string]: any; }) => {/** noop */ }
}

test('renders learn react link', () => {
  render(<App engine={new MockEngine()} />);
  const mainMenu = screen.getByText('snake');
  expect(mainMenu).toBeInTheDocument();
});
