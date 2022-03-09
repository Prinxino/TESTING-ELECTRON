
const electron = require('electron');
const path = require('path');
const url = require('url');

// SET ENV
process.env.NODE_ENV = 'development';

const { app, BrowserWindow , Menu, ipcMain, dialog} = electron;

let addWindow
let mainWindow

function createWindow () {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        devTools: true,
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    mainWindow.loadFile('mainWindow.html')

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

  };

  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
      
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

//  Funzione Aggiungi Progetto

function createAddWindow(){
    BrowserWindow.getAllWindows()[0].loadURL(url.format({
    pathname : path.join(__dirname,'addWindow.html'),
    protocol:'file',
    slashes:true
  }));
};

// Back BTN

ipcMain.on('back-to-previous',()=>{
      BrowserWindow.getAllWindows()[0].loadURL(url.format({
      pathname : path.join(__dirname,'mainWindow.html'),
      protocol:'file',
      slashes:true
    }));
})

// Catch item:add
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents,send('item:add', item);
  addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Aggiungi Progetto',
                click(){
                  createAddWindow();
                }
            },
            {
                label: 'Elimina Progetto',
                click(){
                  mainWindow.webContents.send('item:clear', item);
                }
            },
            {
                label: 'Esci',
                accelerator: process.platform == 'darwin' ? 'Coomand+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];


// Aggiunta developer tools
if(process.env.NODE_ENV !== 'produzione'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Coomand+I' :
        'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}