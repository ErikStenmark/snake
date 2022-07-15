import userEvent from '@testing-library/user-event';
import { defaultMenuContextProps, MenuContextProps } from '../menu-context';
import { renderFactory } from '../__test_utils__';
import useGameControls from './use-game-controls';

const togglePause = jest.fn();
const setEngineOn = jest.fn();

const defaultProps: MenuContextProps = {
  ...defaultMenuContextProps,
  isRunning: true,
  togglePause,
  setEngineOn
}

const Component: React.FC<MenuContextProps> = (props) => {
  useGameControls(props);
  return (<div />);
};

const { render } = renderFactory(Component, { defaultProps });

describe('Hook: use-game-controls', () => {

  it('should toggle pause', () => {
    const { container } = render();
    userEvent.type(container, 'p');
    expect(togglePause).toHaveBeenCalled();
  });

  it('should end shut down engine with esc', () => {
    const { container } = render();
    userEvent.type(container, '{escape}');
    expect(setEngineOn).toHaveBeenCalledWith(false);
  });

});