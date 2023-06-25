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
	},
	
	createDocDir: async(docDirName) => {
    	let response = await ipcRenderer.invoke('create-doc-dir', docDirName);
		console.log(response)
		return response;
	},

	loadDocDir: async () => {
		let response = await ipcRenderer.invoke('load-doc-dir');
		console.log(response)
		return response;
	},

	openDocDir: async(docDirName) => {
    	let response = await ipcRenderer.invoke('open-doc-dir', docDirName);
		console.log(response)
		return response;
	},

	readFile: () => {
    	ipcRenderer.invoke('read-file');
	},

	writeFile: (text) => {
    	ipcRenderer.invoke('write-file', text);
	}

});