import { ScreenSize, TimeAttributes } from './engine/renderer';
import { LevelAttributes } from './level';

type EventPayloadMap = {

  // Renderer
  FIRST_RENDER_DONE: null;
  NEW_FRAME: TimeAttributes;
  PAUSE: boolean;
  SCREEN_RESIZED: ScreenSize;

  // Game
  TICK: null;
  LEVEL_RESIZED: LevelAttributes;
  SNAKE_MOVED: number[];
  FOOD_ADDED: number;
  EAT: null;
  GAME_OVER: null;
}

export const EVENTS: EventsMap = {

  // Renderer
  FIRST_RENDER_DONE: 'FIRST_RENDER_DONE',
  NEW_FRAME: 'NEW_FRAME',
  PAUSE: 'PAUSE',
  SCREEN_RESIZED: 'SCREEN_RESIZED',

  // Game
  TICK: 'TICK',
  LEVEL_RESIZED: 'LEVEL_RESIZED',
  SNAKE_MOVED: 'SNAKE_MOVED',
  FOOD_ADDED: 'FOOD_ADDED',
  EAT: 'EAT',
  GAME_OVER: 'GAME_OVER',
}

export type EventTopics = keyof EventPayloadMap;

export type EventsMap = {
  [Key in EventTopics]: Key
}

export type EventPayloadType<T extends EventTopics> = {
  topic: T;
  data: T extends keyof EventPayloadMap ? EventPayloadMap[T] : never;
}

export default EVENTS;