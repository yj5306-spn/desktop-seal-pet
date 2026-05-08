const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  dragWindow: (data) => ipcRenderer.send('drag-window', data),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
});
