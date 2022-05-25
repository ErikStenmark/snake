import { ipcRenderer, contextBridge } from 'electron';

const api = () => ({
    toggleFullScreen: (): Promise<void> => ipcRenderer.invoke('toggle-full-screen'),
    isFullScreen: (): Promise<boolean> => ipcRenderer.invoke('get-is-full-screen'),
})

contextBridge.exposeInMainWorld('electron', api());

export type Electron = ReturnType<typeof api>;