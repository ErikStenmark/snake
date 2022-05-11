import React from 'react';

export enum HeadingSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

export const headingColor = 'lime'
export const headingFont = 'PressStart2P'

export type HeadingProps = React.HTMLAttributes<HTMLElement> & {
  size?: HeadingSize;
  component?: React.ElementType;
}

const sizeMap: { [key in HeadingSize]: React.ElementType } = {
  [HeadingSize.SMALL]: 'h3',
  [HeadingSize.MEDIUM]: 'h2',
  [HeadingSize.LARGE]: 'h1',
}

const Heading: React.FC<HeadingProps> = ({ size, component, color, style, ...rest }) => {
  const Component = component || (!!size ? sizeMap[size] : 'h1');

  const styleProp: React.HTMLAttributes<HTMLElement>['style'] = {
    fontFamily: headingFont,
    color: color || headingColor,
    ...style,
  }

  return <Component {...rest} style={styleProp} />
}

Heading.displayName = 'Heading';
export default Heading;