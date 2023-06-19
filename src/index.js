const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Make sure to set this to false
      contextIsolation: true, // Enable context isolation
      preload: path.join(__dirname, 'preload.js') // Preload script for context bridge
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Expose a function to open the file in a new window
ipcMain.handle('openFile', (event, filePath) => {
  const newWindow = new BrowserWindow({ show: false });
  newWindow.loadFile(filePath);
  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });
});