import { IEngine } from '../game/engine';

export class MockEngine implements IEngine {
  public run = () => {/* noop */ };
  public end = () => {/* noop */ };
  public pause = () => false;
  public setDataCB = () => {/* noop */ };
  public setOptions = () => {/* noop */ };
  public setOnGameOver = () => { /* noop */ };
}