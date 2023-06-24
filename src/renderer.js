// Access the Electron API via the exposed object
const { sendOpenFolder, receiveFolderContents, openFile, createDocDir } = window.electronAPI;

// receiveFolderContents((contents) => {
//   const filesView = document.getElementById('filesView');
//   filesView.innerText = contents.join('\n');
//   console.log(contents)
//   removeAllChildNodes(filesView)
//   let contentId = 0;
//   while (contentId < contents.length) {
//     let currContentBlock = createContentBlock(contents[contentId]);
//     filesView.appendChild(currContentBlock)
//     contentId++;
//   }
// });

// function removeAllChildNodes(parent) {
//   while (parent.firstChild) {
//       parent.removeChild(parent.firstChild);
//   }
// }

// function createContentBlock(contentName) {

//   const folderBlock = document.createElement('div');
//   folderBlock.className = 'folder-block';

//   const folderIcon = document.createElement('img');
//   folderIcon.className = 'folder-icon'
//   folderIcon.src =`D:/My Projects/doc-org/src/icons/folder-icon.png`;
//   folderBlock.appendChild(folderIcon);

//   const folderContent = document.createElement('div');
//   folderContent.className = 'folder-content';
//   folderContent.textContent = contentName;
//   folderBlock.appendChild(folderContent);
  
// return folderBlock;
// }


//////////////////////////////////////////////////
/////////////// New Doc Directory ////////////////
//////////////////////////////////////////////////

const create_new_dir = document.getElementById('create-new-dir')
const create_new_dir_btn = document.getElementById('create-new-dir-btn')
const folders_view = document.getElementById('foldersView')

create_new_dir_btn.addEventListener('click', async function () {
  let newDirName = document.getElementById('create-new-dir').value
  let messsage = await createDocDir(newDirName)
  if (messsage === 0) {
    let newDirBlock = createDirBtn(newDirName)
    folders_view.appendChild(newDirBlock)
  } else {
    console.log(messsage)
  }
});

function createDirBtn(contentName) {

	const folderBlock = document.createElement('div');
	folderBlock.className = 'folder-btn';
  
	const folderIcon = document.createElement('img');
	folderIcon.className = 'folder-btn-icon'
	folderIcon.src =`D:/My Projects/doc-org/src/icons/folder-icon.png`;
	folderBlock.appendChild(folderIcon);
  
	const folderContent = document.createElement('div');
	folderContent.className = 'folder-btn-content';
	folderContent.textContent = contentName;
	folderBlock.appendChild(folderContent);
	
	return folderBlock;
}