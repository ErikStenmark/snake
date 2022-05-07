import { ScreenSize } from './engine/renderer';
import { LevelAttributes } from './level';

type EventPayloadMap = {
  FIRST_RENDER_DONE: null;
  TICK: null;
  PAUSE: boolean;
  SCREEN_RESIZED: ScreenSize;
  LEVEL_RESIZED: LevelAttributes;
  SNAKE_MOVED: number[];
  FOOD_ADDED: number;
  EAT: null;
}

export const EVENTS: EventsMap = {
  FIRST_RENDER_DONE: 'FIRST_RENDER_DONE',
  TICK: 'TICK',
  PAUSE: 'PAUSE',
  SCREEN_RESIZED: 'SCREEN_RESIZED',
  LEVEL_RESIZED: 'LEVEL_RESIZED',
  SNAKE_MOVED: 'SNAKE_MOVED',
  FOOD_ADDED: 'FOOD_ADDED',
  EAT: 'EAT',
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