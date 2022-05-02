import React from 'react';
import style from './menu.module.css';
import classNames from 'classnames';

export type MenuItem = {
  name: string;
  action: () => void;
  selected?: boolean
}

export type MenuProps = React.HTMLAttributes<HTMLDivElement> & {
  items: MenuItem[];
  onExit?: (() => void) | null | undefined;
}

const Menu: React.FC<MenuProps> = ({ items, onExit, children, className, ...rest }) => {
  const [activeItem, setActiveItem] = React.useState<MenuItem>(items[0]);

  React.useEffect(() => {
    const getItemIndex = () => items.findIndex(item => item.name === activeItem.name);

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

      if (e.key === 'Escape' && !!onExit) {
        onExit();
      }
    }

    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener);
    }
  }, [activeItem, items, onExit]);

  React.useEffect(() => {
    const selected = items.find(item => item.selected);
    setActiveItem(!!selected ? selected : items[0]);
  }, [items, setActiveItem]);

  return (
    <div {...rest} className={classNames(style.root, className)}>
      {children}
      {items.map(item => {

        const classProp = classNames({
          [style.active]: activeItem.name === item.name,
          [style.selected]: item.selected
        })

        return (
          <button key={`menu-item-${item.name}`} className={classProp}>
            {item.name}
          </button>
        );

      })}
    </div>
  );
}

Menu.displayName = 'Menu';
export default Menu;
