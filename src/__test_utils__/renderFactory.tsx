import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

type Component = React.ComponentType<any>;

export interface IComponentFactoryProps<T> {
  defaultProps?: T;
}

export type RenderFactoryProps<T> = IComponentFactoryProps<T> & {
  renderOpts?: RenderOptions
};

export const componentFactory = <T extends {}>(component: Component, opts?: IComponentFactoryProps<T>) => {
  return (newProps: Partial<T> = {}) => {
    const Component = component;
    const props = { ...opts?.defaultProps, ...newProps };

    const PropWrapper = (wrapperProps: T) => (
      <Component {...wrapperProps} />
    );

    return <PropWrapper {...props} />;
  };
};


export const renderFactory = <T extends {}>(component: Component, opts?: RenderFactoryProps<T>) => {
  const create = componentFactory(component, opts);

  const render = (newProps: Partial<T> = {}) => {
    const props = { ...opts?.defaultProps, ...newProps };
    return rtlRender(create(props), { ...opts?.renderOpts });
  };

  return { create, render };
}; 