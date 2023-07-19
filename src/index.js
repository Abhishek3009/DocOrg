const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
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

    mainWindow.webContents.openDevTools()

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

function showAlertBox(message) {
    const options = {
        type: 'info',
        title: 'Alert',
        message: message,
        buttons: ['OK']
    }; 
    dialog.showMessageBox(mainWindow, options);
}

//////////////////////////////////////////////////
/////////////// Directory Handlers ///////////////
//////////////////////////////////////////////////

ipcMain.handle('create-doc-dir', (event, dirName) => {
    var creationStat = 0;

    if (dirName==="") {
        creationStat = 4;
        dialog.showErrorBox('Error', 'Enter Directory Name!');
        return creationStat;
    } else {
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
    }

});

ipcMain.handle('load-doc-dir', (event) => {
    const folderPath = path.join(__dirname, "../doc-dirs");
    if (!fs.existsSync(folderPath)) {
        dialog.showErrorBox('Folder Not Found', 'The specified folder does not exist.');
        return;
    }
    const contents = fs.readdirSync(folderPath);
    return contents
})

ipcMain.handle('open-doc-dir', (event, dirName) => {
    const filePath = path.join(__dirname, "../doc-dirs", dirName + '.txt');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');
        return lines;
    } catch (err) {
        console.error('Error:', err);
        dialog.showErrorBox('Error','There was some error while opening. Retry!')
        return [];
    }
})

ipcMain.handle('rem-doc-dir', (event, dirName) => {
    const filePath = path.join(__dirname, "../doc-dirs", dirName + '.txt');
    fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          dialog.showErrorBox('Unable To Remove', 'Error while removing the directory.');
          return 1;
        }
        console.log('deleted');
      });
    return 0;
})

//////////////////////////////////////////////////
/////////////// Directory Handlers ///////////////
//////////////////////////////////////////////////

ipcMain.handle('add-doc', (event, dirName) => {
	if (dirName === '') {
		dialog.showErrorBox('Alert', 'Select a Directory');
		return '';
	} else {
		return new Promise((resolve, reject) => {
			try {
				const result = dialog.showOpenDialogSync(mainWindow, { filters: [{ name: 'All', extensions: ['*'] }] });
				if (result && result.length > 0) {
					resolve(result[0]);
				} else {
					resolve('canceled');
				}
			} catch (err) {
				console.error(err);
				dialog.showErrorBox('Error', 'An error occurred while opening the file.');
				resolve('error');
			}
		  });	
	}
});

ipcMain.handle('append-doc', (event, pathData, dirName) => {
    var stat = 0;
    const filePath = path.join(__dirname, "../doc-dirs", dirName + '.txt');
    fs.appendFile(filePath, pathData + '\n', (err) => {
      if (err) {
        console.error(err);
        dialog.showErrorBox('Error', 'An error occurred while adding the file.');
        stat = 1;
      }
    });
    return stat;
});

/////////////////////////////////////////////////////////// Window Menu /////////////////////////////////////////////////////////////////////

const DocOrgMenuOptions = [
    {
      label:"About",
      submenu:[
        {
          label:"My Git",
          click: async () => {
            let myGitWin = new BrowserWindow({
              width: 600,
              height: 600,
              title: "GitHub",
              autoHideMenuBar:true,
            });
            myGitWin.loadURL('https://github.com/Abhishek3009')
          },
        }
      ]
    }
]
  
const DocOrgMenu = Menu.buildFromTemplate(DocOrgMenuOptions)
Menu.setApplicationMenu(DocOrgMenu)