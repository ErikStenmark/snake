import { app, BrowserWindow, ipcMain } from 'electron';
import electronReload from 'electron-reload';

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

  mainWindow.setFullScreenable(true);
  mainWindow.loadFile("./public/index.html");
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