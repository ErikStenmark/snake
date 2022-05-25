import { IEngine } from '../game/engine';

export class MockEngine implements IEngine {
    public run = () => {/** noop */ }
    public end = () => {/** noop */ }
    public pause = () => false;
    public setDataCB = (cb: (...args: any) => void) => {/** noop */ }
    public setOptions = (options: { [key: string]: any; }) => {/** noop */ }
}