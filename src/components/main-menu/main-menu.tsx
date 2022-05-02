import React from 'react';
import { GameContext } from '../..';
import Heading, { HeadingSize } from '../heading';
import Menu, { MenuItem } from '../menu';

const MainMenu: React.FC = () => {
  const { isRunning, setGameOn, game } = React.useContext(GameContext);
  const [screen, setScreen] = React.useState('main');

  const [options, setOptions] = React.useState({
    size: 'large',
    walls: 'on',
    speed: 'fast'
  });

  if (isRunning) {
    return null;
  };

  game.setOptions(options);

  const menuItems: MenuItem[] = [
    { name: 'play', action: () => setGameOn(true) },
    { name: 'options', action: () => setScreen('options') }
  ];

  const optionsItems: MenuItem[] = [
    { name: 'size', action: () => { setScreen('size') } },
    { name: 'walls', action: () => { setScreen('walls') } },
    { name: 'speed', action: () => { setScreen('speed') } }
  ];

  const sizeOptions: MenuItem[] = [
    { name: 'small', selected: options.size === 'small', action: () => { setOptions({ ...options, size: 'small' }) } },
    { name: 'medium', selected: options.size === 'medium', action: () => { setOptions({ ...options, size: 'medium' }) } },
    { name: 'large', selected: options.size === 'large', action: () => { setOptions({ ...options, size: 'large' }) } }
  ];

  const wallsOptions: MenuItem[] = [
    { name: 'on', selected: options.walls === 'on', action: () => { setOptions({ ...options, walls: 'on' }) } },
    { name: 'off', selected: options.walls === 'off', action: () => { setOptions({ ...options, walls: 'off' }) } }
  ];

  const speedOptions: MenuItem[] = [
    { name: 'slow', selected: options.speed === 'slow', action: () => { setOptions({ ...options, speed: 'slow' }) } },
    { name: 'medium', selected: options.speed === 'medium', action: () => { setOptions({ ...options, speed: 'medium' }) } },
    { name: 'fast', selected: options.speed === 'fast', action: () => { setOptions({ ...options, speed: 'fast' }) } }
  ];

  const screens: { [key: string]: { onExit: () => void, items: MenuItem[] } } = {
    main: { items: menuItems, onExit: () => { } },
    options: { items: optionsItems, onExit: () => { setScreen('main') } },
    size: { items: sizeOptions, onExit: () => { setScreen('options') } },
    walls: { items: wallsOptions, onExit: () => { setScreen('options') } },
    speed: { items: speedOptions, onExit: () => { setScreen('options') } }
  }

  const isMain = screen === 'main';
  const title = 'snake'

  return (
    <>
      <Menu items={screens[screen].items} onExit={screens[screen].onExit}>
        <Heading style={{ margin: '15px' }} size={isMain ? HeadingSize.LARGE : HeadingSize.SMALL}>
          {isMain ? title : screen}
        </Heading>
      </Menu>
    </>
  );

};

MainMenu.displayName = 'MainMenu';
export default MainMenu;