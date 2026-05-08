const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
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
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

// IPC 기반 커스텀 드래그
ipcMain.on('drag-window', (event, { mouseX, mouseY }) => {
  const cursor = screen.getCursorScreenPoint();
  win.setPosition(cursor.x - mouseX, cursor.y - mouseY);
});

// 우클릭 종료 메뉴
ipcMain.on('show-context-menu', () => {
  const menu = Menu.buildFromTemplate([
    {
      label: '종료',
      click: () => app.quit(),
    },
  ]);
  menu.popup({ window: win });
});
