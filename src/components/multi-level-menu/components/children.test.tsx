import { render } from '@testing-library/react';
import { MenuAction, MenuPage } from './children';
import MultiLevelMenu from '../multi-level-menu';

describe(`Component: ${MultiLevelMenu.displayName} child components`, () => {

  describe(MenuAction.displayName, () => {
    it('should not render anything', () => {
      const { container } = render(<MenuAction
        title='test'
        action={() => { }}
      />);

      expect(container.childElementCount).toBe(0);
    });
  });

  describe(MenuPage.displayName, () => {
    it('should not render anything', () => {
      const { container } = render(<MenuPage
        title='test'
        children={<span />}
      />);

      expect(container.childElementCount).toBe(0);
    });
  });

});