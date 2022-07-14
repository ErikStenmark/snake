import { screen } from '@testing-library/react';
import { menuProviderWrapper } from '../../__test_utils__/menu-provider-wrapper';
import { MockEngine } from '../../__test_utils__/mock-engine';
import { renderFactory } from '../../__test_utils__/renderFactory';
import userEvent from '@testing-library/user-event';
import MainMenu, {
  mainMenuTitle,
  mainOptionsTitle,
  optionsFPSTitle,
  optionsOff,
  optionsOn,
  optionsSizeLarge,
  optionsSizeMedium,
  optionsSizeSmall,
  optionsSizeTitle,
  optionsSpeedFast,
  optionsSpeedMedium,
  optionsSpeedSlow,
  optionsSpeedTitle,
  optionsWallTitle
} from './main-menu';

const runSpy = jest.fn();
const optionsSpy = jest.fn();
const gameOverSpy = jest.fn();

const mockEngine = new MockEngine();
mockEngine.run = runSpy;
mockEngine.setOptions = optionsSpy;
mockEngine.setOnGameOver = gameOverSpy;

const wrapper = menuProviderWrapper({ mockEngine });
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

  it('should open options size menu', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{enter}');
    expect(screen.getByText(optionsSizeTitle)).toBeInTheDocument();
  });

  it('should set option size to small', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      size: optionsSizeSmall
    }));
  });

  it('should set option size to medium', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      size: optionsSizeMedium
    }));
  });

  it('should set option size to large', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      size: optionsSizeLarge
    }));
  });

  it('should open options walls menu', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(screen.getByText(optionsWallTitle)).toBeInTheDocument();
  });

  it('should set option walls to off', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      walls: optionsOff
    }));
  });

  it('should open options speed menu', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(screen.getByText(optionsSpeedTitle)).toBeInTheDocument();
  });

  it('should set option speed to slow', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      speed: optionsSpeedSlow
    }));
  });

  it('should set options speed to medium', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      speed: optionsSpeedMedium
    }));
  });

  it('should set options speed to fast', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      speed: optionsSpeedFast
    }));
  });

  it('should open options fps menu', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(screen.getByText(optionsFPSTitle)).toBeInTheDocument();
  });

  it('should set option fps to on', () => {
    const { container } = render();
    goToOptions(container);
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    userEvent.type(container, '{arrowdown}');
    userEvent.type(container, '{enter}');
    expect(optionsSpy).toHaveBeenCalledWith(expect.objectContaining({
      fps: optionsOn
    }));
  });

});