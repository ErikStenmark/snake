import React from 'react';
import style from './menu.module.css';

export type MenuItem = {
  name: string;
  action: () => void;
}

export type MenuProps = {
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {

  const [activeItem, setActiveItem] = React.useState<MenuItem>(items[0]);
  const getItemIndex = () => items.findIndex(item => item.name === activeItem.name);

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      const indexAmount = items.length - 1;
      const currentIndex = getItemIndex();

      if (e.key === 'ArrowDown' && currentIndex < indexAmount) {
        setActiveItem(items[currentIndex + 1]);
      }

      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setActiveItem(items[currentIndex - 1]);
      }

      if (e.key === 'Enter') {
        activeItem.action();
      }
    }

    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener);
    }
  }, [activeItem, items, getItemIndex]);

  return (
    <div className={style.root}>
      {items.map(item => <button
        key={`menu-item-${item.name}`}
        className={activeItem.name === item.name ? style.active : ''}
      >{
          item.name}
      </button>
      )}
    </div>
  );
}

Menu.displayName = 'Menu';
export default Menu;
