import React, { useContext } from 'react';
import { GameContext } from '../..';
import style from './menu.module.css';

type MenuItem = {
  name: string;
  action: () => void;
}

const MainMenu: React.FC = () => {

  const { setGameOn } = useContext(GameContext);

  const startGame = () => {
    setGameOn(true);
  }

  const openOptions = () => {
    console.log('open options');
  }

  const menuItems: MenuItem[] = [
    { name: 'play', action: startGame },
    { name: 'options', action: openOptions }
  ];

  const [activeItem, setActiveItem] = React.useState<MenuItem>(menuItems[0]);
  const getItemIndex = () => menuItems.findIndex(item => item.name === activeItem.name);

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      const indexAmount = menuItems.length - 1;
      const currentIndex = getItemIndex();

      if (e.key === 'ArrowDown' && currentIndex < indexAmount) {
        setActiveItem(menuItems[currentIndex + 1]);
      }

      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setActiveItem(menuItems[currentIndex - 1]);
      }

      if (e.key === 'Enter') {
        activeItem.action();
      }
    }

    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener);
    }
  }, [activeItem, menuItems, getItemIndex]);

  return (
    <div className={style.root}>
      {menuItems.map(item => <button
        key={`menu-item-${item.name}`}
        className={activeItem.name === item.name ? style.active : ''}
      >{
          item.name}
      </button>
      )}
    </div>
  );
}

MainMenu.displayName = 'MainMenu';
export default MainMenu;
