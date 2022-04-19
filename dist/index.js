"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_reload_1 = __importDefault(require("electron-reload"));
(0, electron_reload_1.default)(__dirname, {});
let mainWindow;
const width = 900;
const height = 600;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width,
        height,
        webPreferences: {
            preload: __dirname + "/preload.js"
        },
        show: false,
    });
    mainWindow.setFullScreenable(true);
    mainWindow.loadFile("./public/index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
};
electron_1.ipcMain.handle('toggle-full-screen', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    mainWindow.setMenuBarVisibility(!mainWindow.isFullScreen());
});
electron_1.ipcMain.handle('get-is-full-screen', () => {
    return mainWindow.isFullScreen();
});
electron_1.app.on("ready", createWindow);
