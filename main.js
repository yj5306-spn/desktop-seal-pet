const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  win.setIgnoreMouseEvents(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('show-context-menu', (event) => {
  const menu = Menu.buildFromTemplate([
    {
      label: '종료',
      click: () => {
        app.quit();
      },
    },
  ]);
  menu.popup({ window: win });
});
