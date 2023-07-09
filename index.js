const { app, BrowserWindow, Menu, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

//JANELAPRINCIPAL
var mainWindow = null;
async function createWindow(){
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {nodeIntegration: true, contextIsolation: false}
        
    });

   await mainWindow.loadFile('src/pages/editor/index.html');

   //mainWindow.webContents.openDevTools();

   createNewfile();
}
//ARQUIVO
var file = {}
//CRIARNOVOARQUIVO
function createNewfile(){
 file = {
    name: 'novo-arquivo.txt',
    content: '',
    saved: false,
    path: app.getPath('documents')+'/novo-arquivo.txt'
 };
 mainWindow.webContents.send('set-file',file);
}

async function saveFileAs(){
  let dialogFile = await dialog.showSaveDialog({
    defaultPath: file.path
  });
  
  //Verificar cancelamento
  if(dialogFile.canceled){
    return false;
  }
    
  //salvar arquivo
  function writeFile(filePath) {
    try {
        fs.writeFileSync(filePath, file.content,function(error){
            //ERRO
           if(error) throw error; 

           //ARQUIVO SALVO
           file.path = filePath;
           file.saved = true;
           file.name = path.basename(filePath);

           console.log(file);
        })
    } catch(e) {
        console.log(e);
    }
}

}

//TEMPLATE MENU
const templateMenu = [
    {
     label:'Funçoes',
     submenu:[
        {
            label:'Novo',
            click(){
                createNewfile();
            }
        },
        {
            label:'Abrir'
        },
        {
            label:'salvar'
        },
        {
            label:'Salvar como',
            click(){
                saveFileAs();
            }
        },
        {
            label:'Fechar',
            role:process.platform === 'darwin' ? 'close' : 'quit'
        }

     ]
    }
];

//MENU

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

//ON READY
app.whenReady().then(createWindow);

//ACTIVATE

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
});
