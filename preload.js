const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
});
