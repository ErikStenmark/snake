import { screen } from '@testing-library/react';
import GameOverMenu, {
  GameOverMenuProps,
  gameOverText,
  gameOverscoreText,
  goMenuMainMenuText,
  goMenuPlayAgainText
} from '.';
import { renderFactory, menuProviderWrapper, MockEngine } from '../../__test_utils__';
import userEvent from '@testing-library/user-event';

const defaultProps: GameOverMenuProps = {
  score: 42
}

const mockEngine = new MockEngine();
mockEngine.run = jest.fn();

const wrapper = menuProviderWrapper({ mockEngine });

const { render } = renderFactory(GameOverMenu, { defaultProps, renderOpts: { wrapper } });

describe(`Component: ${GameOverMenu.displayName}`, () => {
  it('should render all menu content', () => {
    render();
    expect(screen.getByText(gameOverText)).toBeInTheDocument();
    expect(screen.getByText(`${gameOverscoreText} ${defaultProps.score}`));
    expect(screen.getByText(goMenuMainMenuText)).toBeInTheDocument();
    expect(screen.getByText(goMenuPlayAgainText)).toBeInTheDocument();
  });

  it('should run correct actions', async () => {
    const { container } = render();

    const playAgain = screen.getByText(goMenuPlayAgainText);
    const mainMenu = screen.getByText(goMenuMainMenuText);

    expect(playAgain.classList.contains('active')).toBeTruthy();

    expect(mockEngine.run).not.toHaveBeenCalled();
    userEvent.type(container, '{enter}');
    expect(mockEngine.run).toHaveBeenCalled();

    userEvent.type(container, '{arrowDown}');
    expect(mainMenu.classList.contains('active')).toBeTruthy();

    userEvent.type(container, '{enter}');

    /** @todo check that set setEndScore has been called */

  });
});