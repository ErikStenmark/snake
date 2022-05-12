import { screen } from '@testing-library/react';
import { menuProviderWrapper } from '../../__test_utils__/menu-provider-wrapper';
import { MockEngine } from '../../__test_utils__/mock-engine';
import { renderFactory } from '../../__test_utils__/renderFactory';
import MainMenu, { gameTitle } from './main-menu';
import userEvent from '@testing-library/user-event';

const runSpy = jest.fn();

const mockEngine = new MockEngine();
mockEngine.run = runSpy;

const wrapper = menuProviderWrapper(mockEngine);
const { render } = renderFactory(MainMenu, { renderOpts: { wrapper } });

describe('main-menu', () => {

    beforeEach(() => {
        runSpy.mockClear();
    });

    it('should render without crashing', () => {
        render();
        expect(screen.getByText(gameTitle)).toBeInTheDocument();
    });

    it('should run game with enter', () => {
        const { container } = render();
        userEvent.type(container, '{enter}');
        expect(runSpy).toHaveBeenCalled();
    });

});