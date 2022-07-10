import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFactory } from '../../__test_utils__/renderFactory';
import Menu, { MenuItem, MenuProps } from './menu';
import style from './menu.module.css';

const testItem1: MenuItem = {
  name: 'test1',
  action: jest.fn()
}

const testItem2: MenuItem = {
  name: 'test2',
  action: jest.fn()
}
const testItem3: MenuItem = {
  name: 'test3',
  action: jest.fn()
}

const defaultProps: MenuProps = {
  items: [
    testItem1,
    testItem2,
    testItem3
  ]
};

const { render } = renderFactory(Menu, { defaultProps });

describe('menu', () => {

  it('should render', () => {
    const { container } = render();
    expect(container).toBeInTheDocument();
  });

  it('should render items', () => {
    render();

    defaultProps.items.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('should navigate items mark them as active', () => {
    const { container } = render();

    const [item1, item2, item3] = screen.getAllByRole('button');

    expect(item1.classList.contains(style.active)).toBeTruthy();
    expect(item2.classList.contains(style.active)).toBeFalsy();
    expect(item3.classList.contains(style.active)).toBeFalsy();

    userEvent.type(container, '{arrowDown}');

    expect(item1.classList.contains(style.active)).toBeFalsy();
    expect(item2.classList.contains(style.active)).toBeTruthy();
    expect(item3.classList.contains(style.active)).toBeFalsy();

    userEvent.type(container, '{arrowDown}');

    expect(item1.classList.contains(style.active)).toBeFalsy();
    expect(item2.classList.contains(style.active)).toBeFalsy();
    expect(item3.classList.contains(style.active)).toBeTruthy();

    userEvent.type(container, '{arrowDown}');

    expect(item1.classList.contains(style.active)).toBeTruthy();
    expect(item2.classList.contains(style.active)).toBeFalsy();
    expect(item3.classList.contains(style.active)).toBeFalsy();

    userEvent.type(container, '{arrowUp}');

    expect(item1.classList.contains(style.active)).toBeFalsy();
    expect(item2.classList.contains(style.active)).toBeFalsy();
    expect(item3.classList.contains(style.active)).toBeTruthy();
  });

  it('should run item actions', () => {
    const { container } = render();

    expect(testItem1.action).not.toHaveBeenCalled();
    expect(testItem2.action).not.toHaveBeenCalled();
    expect(testItem3.action).not.toHaveBeenCalled();

    userEvent.type(container, '{enter}');
    expect(testItem1.action).toHaveBeenCalled();

    userEvent.type(container, '{arrowDown}');
    userEvent.type(container, '{enter}');
    expect(testItem2.action).toHaveBeenCalled();

    userEvent.type(container, '{arrowDown}');
    userEvent.type(container, '{enter}');
    expect(testItem3.action).toHaveBeenCalled();
  });

  it('should mark items as selected', () => {
    const items = [...defaultProps.items];
    items[1].selected = true;

    render({ items });

    const [item1, item2, item3] = screen.getAllByRole('button');

    expect(item1.classList.contains(style.active)).toBeFalsy();
    expect(item1.classList.contains(style.selected)).toBeFalsy();

    expect(item2.classList.contains(style.active)).toBeTruthy();
    expect(item2.classList.contains(style.selected)).toBeTruthy();

    expect(item3.classList.contains(style.active)).toBeFalsy();
    expect(item3.classList.contains(style.selected)).toBeFalsy();
  });

});