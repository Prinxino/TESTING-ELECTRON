const { app, BrowserWindow , Menu, ipcMain, dialog} = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
  }

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

function indietroWindow(){
    BrowserWindow.getAllWindows()[0].loadURL(url.format({
    pathname : path.join(__dirname,'index.html'),
    protocol:'file',
    slashes:true
  }));
}

// Catch item:add
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents,send('item:add', item);
  addWindow.close();
});

// Back BTN

ipcMain.on('back-to-previous',()=>{
      BrowserWindow.getAllWindows()[0].loadURL(url.format({
      pathname : path.join(__dirname,'index.html'),
      protocol:'file',
      slashes:true
    }));
})



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
                label: 'Elimina Progetto'
            },
            {
              label: 'Indietro',
              click(){
                  indietroWindow();
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