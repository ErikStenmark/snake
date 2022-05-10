import React from 'react';
import { useMenu } from '../../menu-context';
import Heading, { HeadingSize } from '../heading';
import Menu, { MenuItem } from '../menu';

type GameOptSwitch = 'on' | 'off';
export type GameOptSpeed = 'slow' | 'medium' | 'fast';
export type GameOptSize = 'small' | 'medium' | 'large';
export type GameOptWalls = GameOptSwitch;
export type GameOptFPS = GameOptSwitch;

export type GameOptions = {
  size: GameOptSize;
  speed: GameOptSpeed;
  walls: GameOptWalls;
  fps: GameOptFPS;
}

export const defaultGameOpts: GameOptions = {
  size: 'large',
  speed: 'fast',
  walls: 'on',
  fps: 'off'
}

export const gameTitle = 'snake'

const MainMenu: React.FC = () => {
  const { isRunning, setEngineOn, engine } = useMenu();
  const [screen, setScreen] = React.useState('main');
  const [options, setOptions] = React.useState<GameOptions>(defaultGameOpts);

  if (isRunning) {
    return null;
  };

  engine.setOptions(options);

  const setScreenAction = (screen: string) => () => setScreen(screen);

  const menuItems: MenuItem[] = [
    { name: 'play', action: () => setEngineOn(true) },
    { name: 'options', action: setScreenAction('options') }
  ];

  const optionsItems: MenuItem[] = [
    { name: 'size', action: setScreenAction('size') },
    { name: 'walls', action: setScreenAction('walls') },
    { name: 'speed', action: setScreenAction('speed') },
    { name: 'fps', action: setScreenAction('fps') }
  ];

  const isSize = (size: GameOptSize) => options.size === size;
  const setSize = (size: GameOptSize) => () => setOptions({ ...options, size });

  const sizeOptions: MenuItem[] = [
    { name: 'small', selected: isSize('small'), action: setSize('small') },
    { name: 'medium', selected: isSize('medium'), action: setSize('medium') },
    { name: 'large', selected: isSize('large'), action: setSize('large') }
  ];

  const isWalls = (walls: GameOptSwitch) => options.walls === walls;
  const setWalls = (walls: GameOptSwitch) => () => setOptions({ ...options, walls });

  const wallsOptions: MenuItem[] = [
    { name: 'on', selected: isWalls('on'), action: setWalls('on') },
    { name: 'off', selected: isWalls('off'), action: setWalls('off') }
  ];

  const isFps = (fps: GameOptSwitch) => options.fps === fps;
  const setFps = (fps: GameOptSwitch) => () => setOptions({ ...options, fps });

  const fpsOptions: MenuItem[] = [
    { name: 'on', selected: isFps('on'), action: setFps('on') },
    { name: 'off', selected: isFps('off'), action: setFps('off') }
  ]

  const isSpeed = (speed: GameOptSpeed) => options.speed === speed;
  const setSpeed = (speed: GameOptSpeed) => () => setOptions({ ...options, speed });

  const speedOptions: MenuItem[] = [
    { name: 'slow', selected: isSpeed('slow'), action: setSpeed('slow') },
    { name: 'medium', selected: isSpeed('medium'), action: setSpeed('medium') },
    { name: 'fast', selected: isSpeed('fast'), action: setSpeed('fast') }
  ];

  const screens: { [key: string]: { onExit: () => void, items: MenuItem[] } } = {
    main: { items: menuItems, onExit: () => { } },
    options: { items: optionsItems, onExit: setScreenAction('main') },
    size: { items: sizeOptions, onExit: setScreenAction('options') },
    walls: { items: wallsOptions, onExit: setScreenAction('options') },
    speed: { items: speedOptions, onExit: setScreenAction('options') },
    fps: { items: fpsOptions, onExit: setScreenAction('options') }
  }

  const isMain = screen === 'main';
  const size = isMain ? HeadingSize.LARGE : HeadingSize.SMALL;
  const headingText = isMain ? gameTitle : screen;
  const currentScreen = screens[screen];

  return (
    <Menu items={currentScreen.items} onExit={currentScreen.onExit}>
      <Heading style={{ margin: '15px' }} size={size}>
        {headingText}
      </Heading>
    </Menu>
  );

};

MainMenu.displayName = 'MainMenu';
export default MainMenu;