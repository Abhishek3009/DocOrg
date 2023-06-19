const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: (filePath) => {
    ipcRenderer.invoke('openFile', filePath);
  }
});