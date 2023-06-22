const { contextBridge, ipcRenderer } = require('electron');

// Expose specific Electron APIs to the preload script
contextBridge.exposeInMainWorld('electronAPI', {
  sendOpenFolder: (folderPath) => {
    ipcRenderer.send('open-folder', folderPath);
  },
  receiveFolderContents: (callback) => {
    ipcRenderer.on('folder-contents', (_, contents) => {
      callback(contents);
    });
  },
  openFile: (filePath) => {
    ipcRenderer.invoke('openFile', filePath);
  }
});