import { screen } from '@testing-library/react';
import { MockEngine, renderFactory } from '../__test_utils__';
import useGameRunner from './use-game-runner';

const engine = new MockEngine();
engine.run = jest.fn();
engine.end = jest.fn();

const Component: React.FC<{ onState: boolean }> = ({ onState }) => {
  const isRunning = useGameRunner(onState, engine);
  return (<div>{JSON.stringify(isRunning)}</div>);
}

const { render, create } = renderFactory(Component, { defaultProps: { onState: false } });

describe('Hook: use-game-runner', () => {

  it('should run engine run', () => {
    const { rerender } = render();
    expect(engine.run).not.toHaveBeenCalled();
    rerender(create({ onState: true }));
    expect(engine.run).toHaveBeenCalled();
  });

});