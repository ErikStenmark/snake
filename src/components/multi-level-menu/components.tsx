import { MultiLevelMenuChildren } from './multi-level-menu';

export type MenuActionProps = {
  title: string;
  action: (...args: any) => void;
  selected?: boolean;
};

export const MenuAction: React.FC<MenuActionProps> = () => null;
MenuAction.displayName = 'MenuAction';

export type MenuPageProps = {
  title: string;
  children?: MultiLevelMenuChildren;
};

export const MenuPage: React.FC<MenuPageProps> = () => null;
MenuPage.displayName = 'MenuPage';