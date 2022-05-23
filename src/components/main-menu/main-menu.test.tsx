import { screen } from '@testing-library/react';
import { menuProviderWrapper } from '../../__test_utils__/menu-provider-wrapper';
import { MockEngine } from '../../__test_utils__/mock-engine';
import { renderFactory } from '../../__test_utils__/renderFactory';
import MainMenu, { mainMenuTitle, mainOptionsTitle } from './main-menu';
import userEvent from '@testing-library/user-event';

const runSpy = jest.fn();
const optionsSpy = jest.fn();

const mockEngine = new MockEngine();
mockEngine.run = runSpy;
mockEngine.setOptions = optionsSpy;

const wrapper = menuProviderWrapper(mockEngine);
const { render } = renderFactory(MainMenu, { renderOpts: { wrapper } });

describe('main-menu', () => {

    beforeEach(() => {
        runSpy.mockClear();
        optionsSpy.mockClear();
    });

    const goToOptions = (container: HTMLElement) => {
        userEvent.type(container, '{arrowdown}');
        userEvent.type(container, '{enter}');
        return container;
    }

    it('should render without crashing', () => {
        render();
        expect(screen.getByText(mainMenuTitle)).toBeInTheDocument();
    });

    it('should run game with enter', () => {
        const { container } = render();
        userEvent.type(container, '{enter}');
        expect(runSpy).toHaveBeenCalled();
    });

    it('should open options menu', () => {
        const { container } = render();
        goToOptions(container);
        expect(screen.getByText(mainOptionsTitle)).toBeInTheDocument();
    });

});