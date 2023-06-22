const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('open-folder', function (event, folderPath) {
    if (!fs.existsSync(folderPath)) {
        dialog.showErrorBox('Folder Not Found', 'The specified folder does not exist.');
        return;
    }

    const contents = fs.readdirSync(folderPath);
    event.reply('folder-contents', contents);
});

ipcMain.handle('openFile', (event, filePath) => {
  const newWindow = new BrowserWindow({ show: false });
  newWindow.loadFile(filePath);
  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });
});