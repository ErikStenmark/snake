import { IEngine } from '../game/engine';
import { MockEngine } from './mock-engine';
import MenuProvider from '../menu-context';

const deafultEngine = new MockEngine();

export const menuProviderWrapper = (mockEngine: IEngine = deafultEngine) => {
  return ({ children }: any) => (
    <MenuProvider engine={mockEngine}>
      {children}
    </MenuProvider>
  );
}