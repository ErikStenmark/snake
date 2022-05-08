import React from 'react';
import { IEngine } from '../game/engine';
import useGameData from '../hooks/use-game-data';
import useGameRunner from '../hooks/use-game-runner';
import usePause from '../hooks/use-pause';

import MenuContext, { menuContextFactory } from './menu-context';

type MenuProviderProps = React.PropsWithChildren<{
  engine: IEngine;
}>

const MenuProvider: React.FC<MenuProviderProps> = ({ children, engine }) => {
  const [engineOn, setEngineOn] = React.useState(false);
  const data = useGameData(engine);
  const isRunning = useGameRunner(engineOn, engine);
  const [isPaused, togglePause] = usePause(engine, isRunning);

  const factory = menuContextFactory({
    data,
    engine,
    isRunning,
    isPaused,
    setEngineOn,
    togglePause
  });

  return (
    <MenuContext.Provider value={factory}>
      {children}
    </MenuContext.Provider>
  );
}

MenuProvider.displayName = 'MenuProvider';
export default MenuProvider;