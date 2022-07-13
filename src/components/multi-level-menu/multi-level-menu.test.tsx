import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFactory } from '../../__test_utils__';
import MultiLevelMenu, {
  MenuAction,
  MenuActionProps,
  MenuPage,
  MenuPageProps
} from './';

const page1Props: MenuPageProps = { title: 'page1' };
const page2Props: MenuPageProps = { title: 'page2' };
const action1Props: MenuActionProps = { title: 'action1', action: jest.fn() };
const action2Props: MenuActionProps = { title: 'action2', action: jest.fn() };
const action3Props: MenuActionProps = { title: 'action3', action: jest.fn() };

const Component: React.FC = () =>
  <MultiLevelMenu>
    <MenuAction {...action1Props} />
    <MenuPage {...page1Props}>
      <MenuAction {...action2Props} />
      <MenuPage {...page2Props}>
        <MenuAction {...action3Props} />
      </MenuPage>
    </MenuPage>
  </MultiLevelMenu>

const { render } = renderFactory(Component);

describe(`Component: ${MultiLevelMenu.displayName}`, () => {

  it('should display correct items', () => {
    render();

    expect(screen.getByText(action1Props.title)).toBeInTheDocument();
    expect(screen.getByText(page1Props.title)).toBeInTheDocument();

    expect(screen.queryByText(page2Props.title)).not.toBeInTheDocument();
    expect(screen.queryByText(action2Props.title)).not.toBeInTheDocument();
    expect(screen.queryByText(action3Props.title)).not.toBeInTheDocument();
  });

  it('should display active items', () => {
    const { container } = render();

    const [button1, button2] = screen.getAllByRole('button');
    expect(button1.classList.contains('active')).toBeTruthy();
    expect(button2.classList.contains('active')).toBeFalsy();

    userEvent.type(container, '{arrowDown}');
    expect(button1.classList.contains('active')).toBeFalsy();
    expect(button2.classList.contains('active')).toBeTruthy();

    userEvent.type(container, '{arrowDown}');
    expect(button1.classList.contains('active')).toBeTruthy();
    expect(button2.classList.contains('active')).toBeFalsy();
  });

  it('should navigate menus and run actions', () => {
    const { container } = render();

    userEvent.type(container, '{enter}');
    expect(action1Props.action).toHaveBeenCalled();

    userEvent.type(container, '{arrowDown}');
    userEvent.type(container, '{enter}');
    expect(screen.getByText(page2Props.title)).toBeInTheDocument();
    expect(screen.getByText(action2Props.title)).toBeInTheDocument();

    userEvent.type(container, '{enter}');
    expect(action2Props.action).toHaveBeenCalled();

    userEvent.type(container, '{arrowDown}');
    userEvent.type(container, '{enter}');
    expect(screen.getByText(action3Props.title)).toBeInTheDocument();

    userEvent.type(container, '{enter}');
    expect(action3Props.action).toHaveBeenCalled();

    userEvent.type(container, '{escape}');
    expect(screen.getByText(page2Props.title)).toBeInTheDocument();
    expect(screen.getByText(action2Props.title)).toBeInTheDocument();

    userEvent.type(container, '{escape}');
    expect(screen.getByText(page1Props.title)).toBeInTheDocument();
    expect(screen.getByText(action1Props.title)).toBeInTheDocument();
  });

});