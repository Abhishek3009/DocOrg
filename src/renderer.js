// Access the Electron API via the exposed object
const { sendOpenFolder, receiveFolderContents, openFile } = window.electronAPI;

// Access the Electron API via the exposed object
document.getElementById('openButton').addEventListener('click', function () {
  const folderPath = document.getElementById('folderPath').value;
  sendOpenFolder(folderPath);
});

receiveFolderContents((contents) => {
  const filesView = document.getElementById('filesView');
  // filesView.innerText = contents.join('\n');
  console.log(contents)
  removeAllChildNodes(filesView)
  let contentId = 0;
  while (contentId < contents.length) {
    let currContentBlock = createContentBlock(contents[contentId]);
    filesView.appendChild(currContentBlock)
    contentId++;
  }
});

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function createContentBlock(contentName) {

  const folderBlock = document.createElement('div');
  folderBlock.className = 'folder-block';

  const folderIcon = document.createElement('img');
  folderIcon.className = 'folder-icon'
  folderIcon.src =`D:/My Projects/doc-org/src/icons/folder-icon.png`;
  folderBlock.appendChild(folderIcon);

  const folderContent = document.createElement('div');
  folderContent.className = 'folder-content';
  folderContent.textContent = contentName;
  folderBlock.appendChild(folderContent);
  
return folderBlock;
}