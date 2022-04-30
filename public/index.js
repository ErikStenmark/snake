"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_reload_1 = __importDefault(require("electron-reload"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const path_1 = __importDefault(require("path"));
(0, electron_reload_1.default)(__dirname, {});
let mainWindow;
const width = 600;
const height = 600;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width,
        height,
        minHeight: 200,
        minWidth: 200,
        webPreferences: {
            preload: __dirname + "/preload.js"
        },
        show: false,
    });
    mainWindow.loadURL(electron_is_dev_1.default
        ? 'http://localhost:3000'
        : `file://${path_1.default.join(__dirname, '../build/index.html')}`);
    mainWindow.setFullScreenable(true);
    // mainWindow.loadFile("./public/index.html");
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
