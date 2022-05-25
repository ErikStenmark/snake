import React from 'react';
import Heading, { HeadingSize } from '../heading';
import Menu, { MenuItem, MenuProps } from '../menu';

type MenuAction = (...args: any) => void;
type ActionItemProps = {
    action: MenuAction;
    selected?: boolean;
    children: string | number;
};

export const ActionItem: React.FC<ActionItemProps> = () => null;
ActionItem.displayName = 'ActionItem';

type SubMenuItemProps = {
    title: string;
    children?: MultiLevelMenuChildren;
};

export const SubMenuItem: React.FC<SubMenuItemProps> = () => null;
SubMenuItem.displayName = 'MenuItem';

type MenuItemProps = ActionItemProps | SubMenuItemProps;
type MultiLevelMenuChild = React.ReactElement<MenuItemProps>;
type MultiLevelMenuChildren = MultiLevelMenuChild | Array<MultiLevelMenuChild>;

export type MultiLevelMenuProps = Partial<MenuProps> & {
    mainTitle?: string;
    children?: MultiLevelMenuChildren;
};

export const MultiLevelMenu: React.FC<MultiLevelMenuProps> = ({ children, mainTitle, ...rest }) => {
    const [screen, setScreen] = React.useState<MultiLevelMenuChildren>(children);
    const [breadCrumbs, setBreadCrumbs] = React.useState<string[]>([]);

    const getItemName = (item: MultiLevelMenuChild) => {
        if (item.type === ActionItem) {
            return item.props.children.toString();
        }

        return (item.props as SubMenuItemProps).title.toString();
    };

    const travelToLastCrumb = () => {
        if (!breadCrumbs.length) {
            setScreen(children);
        } else {
            let temp: MultiLevelMenuChildren;
            breadCrumbs.forEach((crumb, i) => {
                const current = i === 0 ? children : temp;
                const currentArr = Array.isArray(current) ? current : [current];
                const next = currentArr.find(item => getItemName(item) === crumb);

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

    const menuItems: MenuItem[] = React.Children.map(screen, item => {
        const type = item.type as React.FC;
        const variant = type.displayName === ActionItem.displayName ? 'action' : 'submenu';

        const name = getItemName(item);

        const selected = variant === 'action'
            ? (item.props as ActionItemProps).selected
            : false;

        const action = variant === 'action'
            ? (item.props as ActionItemProps).action
            : () => {
                setBreadCrumbs([...breadCrumbs, name]);
                setScreen((item.props as SubMenuItemProps).children as MultiLevelMenuChildren);
            };

        return { name, action, selected };
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