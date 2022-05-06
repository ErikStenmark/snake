import { ScreenSize } from './engine/renderer';
import { LevelAttributes } from './level';

type EventPayloadMap = {
  SCREEN_RESIZED: ScreenSize;
  LEVEL_RESIZED: LevelAttributes;
}

export const EVENTS: EventsMap = {
  SCREEN_RESIZED: 'SCREEN_RESIZED',
  LEVEL_RESIZED: 'LEVEL_RESIZED'
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