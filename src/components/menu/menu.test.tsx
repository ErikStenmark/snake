import { renderFactory } from '../../__test_utils__/renderFactory';
import Menu, { MenuProps } from './menu';

const defaultProps: MenuProps = {
    items: []
};

const { render } = renderFactory(Menu, { defaultProps });

describe('menu', () => {

    it('should render', () => {
        const { container } = render();
        expect(container).toBeInTheDocument();
    });

});