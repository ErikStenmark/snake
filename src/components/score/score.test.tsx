import Score, { scoreText } from './score';
import { MockEngine, mockMenuProviderFactory, renderFactory } from '../../__test_utils__';
import { MenuContextProps } from '../../menu-context';
import { screen } from '@testing-library/react';

const Component: React.FC<Partial<MenuContextProps>> = (props) => {
  const engine = new MockEngine();
  const Provider = mockMenuProviderFactory(props);

  return (
    <Provider engine={engine}>
      <Score />
    </Provider>
  );
}

const { render, create } = renderFactory(Component);

describe(`Component: ${Score.displayName}`, () => {

  it('should render correct score when engine is running', () => {
    const { container, rerender } = render();
    expect(container.childElementCount).toBe(0);

    const score = 42;
    rerender(create({ isRunning: true, data: { score } }));
    expect(screen.getByText(`${scoreText} ${score}`)).toBeInTheDocument();
  });

});