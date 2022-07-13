import { menuProviderWrapper, renderFactory } from '../../__test_utils__';
import PauseMenu from './pause-menu';

const wrapper = menuProviderWrapper();

const { render } = renderFactory(PauseMenu, { renderOpts: { wrapper } });

describe(`Component: ${PauseMenu.displayName}`, () => {
  it('should not render anything by default', () => {
    const { container } = render();
    expect(container.childElementCount).toBe(0);
  });
});