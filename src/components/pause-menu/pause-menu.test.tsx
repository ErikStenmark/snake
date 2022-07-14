import { screen } from '@testing-library/react';
import { MenuContextProps } from '../../menu-context';
import { MockEngine, mockMenuProviderFactory, renderFactory } from '../../__test_utils__';
import PauseMenu, { pauseMenuText } from './pause-menu';

const Component: React.FC<Partial<MenuContextProps>> = (props) => {
  const engine = new MockEngine();
  const Provider = mockMenuProviderFactory(props);

  return (
    <Provider engine={engine}>
      <PauseMenu />
    </Provider>
  );
}

const { render, create } = renderFactory(Component);

describe(`Component: ${PauseMenu.displayName}`, () => {

  it('should only render when paused', () => {
    const { container, rerender } = render({ isPaused: false });
    expect(container.childElementCount).toBe(0);

    rerender(create({ isPaused: true }));
    expect(screen.getByText(pauseMenuText)).toBeInTheDocument();
  });

});