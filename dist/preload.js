"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = () => ({
    toggleFullScreen: () => electron_1.ipcRenderer.invoke('toggle-full-screen'),
    isFullScreen: () => electron_1.ipcRenderer.invoke('get-is-full-screen'),
});
electron_1.contextBridge.exposeInMainWorld('electron', api());
