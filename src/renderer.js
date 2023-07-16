// Access the Electron API via the exposed object
const { sendOpendir, receivedirContents, openFile, 
		createDocDir, loadDocDir, openDocDir,
		addDoc										} = window.electronAPI;

//////////////////////////////////////////////////
/////////////// Element Variables ////////////////
//////////////////////////////////////////////////

const body = document.body
const dirs_view = document.getElementById('dirsView')

const create_new_dir = document.getElementById('create-new-dir')
const create_new_dir_btn = document.getElementById('create-new-dir-btn')
const add_doc = document.getElementById('add-doc')


// receivedirContents((contents) => {
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

//   const dirButton = document.createElement('div');
//   dirButton.className = 'dir-block';

//   const dirIcon = document.createElement('img');
//   dirIcon.className = 'dir-icon'
//   dirIcon.src =`D:/My Projects/doc-org/src/icons/dir-icon.png`;
//   dirButton.appendChild(dirIcon);

//   const dirContent = document.createElement('div');
//   dirContent.className = 'dir-content';
//   dirContent.textContent = contentName;
//   dirButton.appendChild(dirContent);
  
// return dirButton;
// }

//////////////////////////////////////////////////
//////////////// Initialization //////////////////
//////////////////////////////////////////////////

function removeExtension(filename) {
	return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

async function loadSideBar() {
	const contents = await loadDocDir()
	console.log(contents)
	let contentId = 0;
	while (contentId < contents.length) {
		dirName = removeExtension(contents[contentId])
		let currContentBlock = createDirBtn(dirName);
		dirs_view.appendChild(currContentBlock)
		contentId++;
	}
};

body.onload = loadSideBar();


//////////////////////////////////////////////////
/////////////// Directory Options ////////////////
//////////////////////////////////////////////////

// Create Directory
create_new_dir_btn.addEventListener('click', async function () {
  let newDirName = document.getElementById('create-new-dir').value
  let messsage = await createDocDir(newDirName)
  if (messsage === 0) {
    let newDirBlock = createDirBtn(newDirName)
    dirs_view.appendChild(newDirBlock)
  } else {
    console.log(messsage)
  }
});
function createDirBtn(contentName) {
	const dirButton = document.createElement('button');
	dirButton.className = 'doc-org-button';	
	dirButton.setAttribute('onclick', "opendir('"+contentName+"')");

	const dirBlock = document.createElement('div');

	const dirIcon = document.createElement('img');
	dirIcon.className = 'doc-org-button-icon'
	dirIcon.src =`D:/My Projects/doc-org/src/icons/dir-icon.png`;
	dirBlock.appendChild(dirIcon);
	const dirContent = document.createElement('div');
	dirContent.className = 'doc-org-button-content';
	dirContent.textContent = contentName;
	dirBlock.appendChild(dirContent);
	dirButton.appendChild(dirBlock);
	return dirButton;
}

//Open Directory
function opendir(dirName) {
	openDocDir(dirName);
	return;
}

// Remove Directory


//////////////////////////////////////////////////
/////////////// Directory Options ////////////////
//////////////////////////////////////////////////

// Add Document
add_doc.addEventListener('click', async function () {
	let messsage = await addDoc()
});