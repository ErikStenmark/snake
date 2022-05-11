import { screen } from '@testing-library/react';
import { renderFactory } from '../../__test_utils__/renderFactory';
import Heading, {
  headingColor,
  headingFont,
  HeadingProps,
  HeadingSize
} from './heading';

const mockHeading = 'this is a heading';

const defaultProps: HeadingProps = {
  children: 'this is a heading'
};

const { render, create } = renderFactory(Heading, { defaultProps });

describe(`component: ${Heading.displayName}`, () => {

  it('should render default heading', () => {
    const { rerender } = render();
    const heading = screen.getByText(mockHeading);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle(`color: ${headingColor}`);
    expect(heading).toHaveStyle(`font-family: ${headingFont}`);

    expect(screen.queryByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();

    rerender(create({ size: HeadingSize.LARGE }));
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('should render in different sizes', () => {
    const { rerender } = render({ size: HeadingSize.MEDIUM });
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    rerender(create({ size: HeadingSize.SMALL }));
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('should set color with color prop and override with style prop', () => {
    const firstColor = 'red';
    const secondColor = 'green';
    const thirdColor = 'blue';

    const { rerender } = render({ color: firstColor });
    expect(screen.getByText(mockHeading)).toHaveStyle(`color: ${firstColor}`);

    rerender(create({ color: secondColor }));
    expect(screen.getByText(mockHeading)).toHaveStyle(`color: ${secondColor}`);

    rerender(create({ color: secondColor, style: { color: thirdColor } }));
    expect(screen.getByText(mockHeading)).toHaveStyle(`color: ${thirdColor}`);
  });

  it('should override default font with style prop', () => {
    const font = 'Arial';
    render({ style: { fontFamily: font } });
    expect(screen.getByText(mockHeading)).toHaveStyle(`font-family: ${font}`);
  });

  it('should pass rest of div props', () => {
    render({ "aria-label": "heading" });
    expect(screen.getByRole('heading')).toHaveAttribute('aria-label', 'heading');
  });

});