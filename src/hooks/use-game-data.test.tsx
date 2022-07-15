import { screen } from '@testing-library/react';
import { MockEngine, renderFactory } from '../__test_utils__';
import useGameData from './use-game-data';

const testValue = 'this is a test value';

const engine = new MockEngine();
engine.setDataCB = (cb: (...args: any) => void) => cb(testValue);

const Component: React.FC = () => {
  const data = useGameData(engine);

  return (
    <div>
      {data}
    </div>
  );
}

const { render } = renderFactory(Component);

describe('Hook: use-game-data', () => {

  it('should set the data callback and return the callback value', () => {
    render();
    expect(screen.getByText(testValue)).toBeInTheDocument();
  });

});