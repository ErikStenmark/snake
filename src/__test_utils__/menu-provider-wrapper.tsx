import { IEngine } from '../game/engine';
import { MockEngine } from './mock-engine';
import { MenuContextProps } from '../menu-context';
import { mockMenuProviderFactory } from './mock-menu-provider-factory';

const defaultEngine = new MockEngine();

type MenuProviderWrapperProps = Partial<{
  mockEngine: IEngine;
  menuProps: Partial<MenuContextProps>
}>

export const menuProviderWrapper = (opts: MenuProviderWrapperProps = {}) => {
  const Provider = mockMenuProviderFactory(opts.menuProps);
  const mockEngine = !!opts.mockEngine ? opts.mockEngine : defaultEngine;

  /* eslint-disable react/display-name */
  return ({ children }: any) => (
    <Provider engine={mockEngine}>
      {children}
    </Provider>
  );
}