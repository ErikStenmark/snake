import React from 'react';

export enum HeadingSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

type HeadingProps = React.HTMLAttributes<HTMLElement> & {
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
    fontFamily: 'PressStart2P',
    color: color || 'lime',
    ...style,
  }

  return <Component {...rest} style={styleProp} />
}

Heading.displayName = 'Heading';
export default Heading;