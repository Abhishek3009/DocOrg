const { app, BrowserWindow, ipcMain, contextBridge, dialog } = require('electron');
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


//////////////////////////////////////////////////
///////////// Doc Directory Handlers /////////////
//////////////////////////////////////////////////

ipcMain.handle('create-doc-dir', (event, dirName) => {
    var creationStat = 0;
    try {
        try {
            if (!fs.existsSync("doc-dirs")) {
                fs.mkdirSync("doc-dirs");
            }
        } catch (err) {
            console.error(err);
        }
        const filePath = path.join(__dirname, "../doc-dirs", dirName + '.txt');
        if (fs.existsSync(filePath)) {
            dialog.showErrorBox('Error', 'Dir already exists.');
            creationStat = 1;
        }
        fs.writeFile(filePath, '', (err) => {
            if (err) {
            console.error(err);
            dialog.showErrorBox('Error', 'Failed to create dir.');
            creationStat = 2;
            }
        });
    } 
    catch (err) {
      console.error(err);
      dialog.showErrorBox('Error', 'An error occurred while saving the file.');
      creationStat = 3;
    }
    return creationStat
});

ipcMain.handle('open-doc-dir', (event, dirName) => {
    const filePath = path.join(__dirname, "../doc-dirs", dirName + '.txt');
    try {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
            console.error(err);
            dialog.showErrorBox('Error', 'Failed to read file.');
            } else {
            dialog.showMessageBox(mainWindow, { type: 'info', message: data });
            }
        });
    }
    catch (err) {
        console.error(err);
        dialog.showErrorBox('Error', 'An error occurred while opening the file.');
    }
})