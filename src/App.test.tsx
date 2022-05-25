import App from './app';
import { render, screen } from '@testing-library/react';
import { mainMenuTitle } from './components/main-menu';
import { menuProviderWrapper } from './__test_utils__/menu-provider-wrapper';

const wrapper = menuProviderWrapper();

describe('App', () => {
  it('should render the main-menu', () => {
    render(<App />, { wrapper });
    const mainMenu = screen.getByText(mainMenuTitle, { exact: false });
    expect(mainMenu).toBeInTheDocument();
  });
});
