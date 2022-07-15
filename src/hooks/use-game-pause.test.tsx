import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockEngine, renderFactory } from '../__test_utils__';
import useGamePause from './use-game-pause';

const engine = new MockEngine();
engine.pause = () => true;

const toggleText = 'toggle';

const Component: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
  const [isPaused, togglePause] = useGamePause(engine, isRunning);

  return (
    <>
      <button onClick={() => togglePause()}>{toggleText}</button>
      <div>{`${isPaused}`}</div>
    </>
  );
}

const { render } = renderFactory(Component, { defaultProps: { isRunning: false } });

describe('Hook: use-game-pause', () => {

  it('should return isPaused boolean', () => {
    render();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('should run engine pause function', () => {
    render({ isRunning: true });
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('true')).toBeInTheDocument();
  });

});