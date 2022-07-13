import React from 'react';
import Heading, { HeadingSize } from '../heading';
import Menu, { MenuItem, MenuProps } from '../menu';
import { MenuAction, MenuActionProps, MenuPage, MenuPageProps } from './components/children';


type MenuItemProps = MenuActionProps | MenuPageProps;
type MultiLevelMenuChild = React.ReactElement<MenuItemProps>;
export type MultiLevelMenuChildren = MultiLevelMenuChild | Array<MultiLevelMenuChild>;

export type MultiLevelMenuProps = Partial<MenuProps> & {
  mainTitle?: string;
  children?: MultiLevelMenuChildren;
};

const allowedChildren = [
  MenuAction.displayName,
  MenuPage.displayName
];

export const MultiLevelMenu: React.FC<MultiLevelMenuProps> = ({ children, mainTitle, ...rest }) => {
  const [screen, setScreen] = React.useState<MultiLevelMenuChildren>(children);
  const [breadCrumbs, setBreadCrumbs] = React.useState<string[]>([]);

  const travelToLastCrumb = () => {
    if (!breadCrumbs.length) {
      setScreen(children);
    } else {
      let temp: MultiLevelMenuChildren;
      breadCrumbs.forEach((crumb, i) => {
        const current = i === 0 ? children : temp;
        const currentArr = Array.isArray(current) ? current : [current];
        const next = currentArr.find(item => item.props.title === crumb);

        if (next) {
          temp = (next.props.children as MultiLevelMenuChildren);
        }

        if (i === breadCrumbs.length - 1) {
          setScreen(temp);
        }

      });
    }
  };

  React.useEffect(() => {
    travelToLastCrumb();
  }, [children, travelToLastCrumb]);

  const menuItems: MenuItem[] = [];

  React.Children.forEach(screen, item => {
    const { type, props } = item;
    const { displayName } = type as React.FC;

    if (allowedChildren.includes(displayName)) {
      const isAction = displayName === MenuAction.displayName;
      const { title } = props;

      const selected = isAction
        ? (props as MenuActionProps).selected
        : false;

      const action = isAction
        ? (props as MenuActionProps).action
        : () => {
          setBreadCrumbs([...breadCrumbs, title]);
          setScreen((props as MenuPageProps).children as MultiLevelMenuChildren);
        };

      menuItems.push({ name: title, action, selected });
    }

  });

  const back = () => {
    breadCrumbs.pop();
    travelToLastCrumb();
  };

  const heading = breadCrumbs.length
    ? breadCrumbs[breadCrumbs.length - 1]
    : mainTitle;

  const headingSize = breadCrumbs.length
    ? HeadingSize.SMALL
    : HeadingSize.LARGE;

  return (
    <Menu {...rest} items={menuItems} onExit={back}>
      {!!heading && <Heading size={headingSize}>{heading}</Heading>}
    </Menu>
  );
};

MultiLevelMenu.displayName = 'MultiLevelMenu';
export default MultiLevelMenu;