import { app, BrowserWindow, ipcMain } from 'electron';
import electronReload from 'electron-reload';
import isDev from 'electron-is-dev';
import path from 'path';

electronReload(__dirname, {});

let mainWindow: BrowserWindow;

const width = 600;
const height = 600;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width,
    height,
    minHeight: 200,
    minWidth: 200,
    webPreferences: {
      preload: __dirname + "/preload.js"
    },
    show: false,
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  mainWindow.setFullScreenable(true);
  // mainWindow.loadFile("./public/index.html");
  mainWindow.on("ready-to-show", () => mainWindow.show());
}

ipcMain.handle('toggle-full-screen', () => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
  mainWindow.setMenuBarVisibility(!mainWindow.isFullScreen());
});

ipcMain.handle('get-is-full-screen', () => {
  return mainWindow.isFullScreen();
});

app.on("ready", createWindow);