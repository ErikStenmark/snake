import { menuProviderWrapper, renderFactory } from '../../__test_utils__';
import Score from './score';

const wrapper = menuProviderWrapper();
const { render } = renderFactory(Score, { renderOpts: { wrapper } });

describe(`Component: ${Score.displayName}`, () => {

  it('should not render anything by default', () => {
    render();
    const { container } = render();

    expect(container.childElementCount).toBe(0);
  });

});