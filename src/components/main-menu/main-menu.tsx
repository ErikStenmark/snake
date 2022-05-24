import React from 'react';
import { useMenu } from '../../menu-context';
import MultiLevelMenu, { ActionItem, SubMenuItem } from '../multi-level-menu';

type GameOptSwitch = 'on' | 'off';
export type GameOptSpeed = 'slow' | 'medium' | 'fast';
export type GameOptSize = 'small' | 'medium' | 'large';
export type GameOptWalls = GameOptSwitch;
export type GameOptFPS = GameOptSwitch;

export type GameOptions = {
  size: GameOptSize;
  speed: GameOptSpeed;
  walls: GameOptWalls;
  fps: GameOptFPS;
}

export const defaultGameOpts: GameOptions = {
  size: 'large',
  speed: 'fast',
  walls: 'on',
  fps: 'off'
}

export const mainMenuTitle = 'snake';

export const mainPlayTitle = 'play';
export const mainOptionsTitle = 'options';

export const optionsSizeTitle = 'size';
export const optionsWallTitle = 'walls';
export const optionsSpeedTitle = 'speed';
export const optionsFPSTitle = 'fps';

export const optionsSizeSmall = 'small';
export const optionsSizeMedium = 'medium';
export const optionsSizeLarge = 'large';

export const optionsSpeedSlow = 'slow';
export const optionsSpeedMedium = 'medium';
export const optionsSpeedFast = 'fast';

export const optionsOn = 'on';
export const optionsOff = 'off';

const MainMenu: React.FC = () => {
  const { setEngineOn, engine } = useMenu();
  const [options, setOptions] = React.useState<GameOptions>(defaultGameOpts);

  engine.setOptions(options);

  const isSize = (size: GameOptSize) => options.size === size;
  const setSize = (size: GameOptSize) => () => setOptions({ ...options, size });

  const isWalls = (walls: GameOptSwitch) => options.walls === walls;
  const setWalls = (walls: GameOptSwitch) => () => setOptions({ ...options, walls });

  const isSpeed = (speed: GameOptSpeed) => options.speed === speed;
  const setSpeed = (speed: GameOptSpeed) => () => setOptions({ ...options, speed });

  const isFps = (fps: GameOptSwitch) => options.fps === fps;
  const setFps = (fps: GameOptSwitch) => () => setOptions({ ...options, fps });

  return (
    <MultiLevelMenu mainTitle={mainMenuTitle}>
      <ActionItem action={() => setEngineOn(true)}>
        {mainPlayTitle}
      </ActionItem>
      <SubMenuItem title={mainOptionsTitle}>
        <SubMenuItem title={optionsSizeTitle}>
          <ActionItem action={setSize(optionsSizeSmall)} selected={isSize(optionsSizeSmall)}>
            {optionsSizeSmall}
          </ActionItem>
          <ActionItem action={setSize(optionsSizeMedium)} selected={isSize(optionsSizeMedium)}>
            {optionsSizeMedium}
          </ActionItem>
          <ActionItem action={setSize(optionsSizeLarge)} selected={isSize(optionsSizeLarge)}>
            {optionsSizeLarge}
          </ActionItem>
        </SubMenuItem>
        <SubMenuItem title={optionsWallTitle}>
          <ActionItem action={setWalls(optionsOn)} selected={isWalls(optionsOn)}>
            {optionsOn}
          </ActionItem>
          <ActionItem action={setWalls(optionsOff)} selected={isWalls(optionsOff)}>
            {optionsOff}
          </ActionItem>
        </SubMenuItem>
        <SubMenuItem title={optionsSpeedTitle}>
          <ActionItem action={setSpeed(optionsSpeedSlow)} selected={isSpeed(optionsSpeedSlow)}>
            {optionsSpeedSlow}
          </ActionItem>
          <ActionItem action={setSpeed(optionsSpeedMedium)} selected={isSpeed(optionsSpeedMedium)}>
            {optionsSpeedMedium}
          </ActionItem>
          <ActionItem action={setSpeed(optionsSpeedFast)} selected={isSpeed(optionsSpeedFast)}>
            {optionsSpeedFast}
          </ActionItem>
        </SubMenuItem>
        <SubMenuItem title={optionsFPSTitle}>
          <ActionItem action={setFps(optionsOn)} selected={isFps(optionsOn)}>
            {optionsOn}
          </ActionItem>
          <ActionItem action={setFps(optionsOff)} selected={isFps(optionsOff)}>
            {optionsOff}
          </ActionItem>
        </SubMenuItem>
      </SubMenuItem>
    </MultiLevelMenu>
  );
};

MainMenu.displayName = 'MainMenu';
export default MainMenu;