import React from 'react'
import { IEngine } from '../game/engine';
import { MockEngine } from './mock-engine';
import MenuProvider from '../menu-context';

const defaultEngine = new MockEngine();

export const menuProviderWrapper = (mockEngine: IEngine = defaultEngine) => {
  /* eslint-disable react/display-name */
  return ({ children }: any) => (
    <MenuProvider engine={mockEngine}>
      {children}
    </MenuProvider>
  );
}