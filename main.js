const { app, BrowserWindow , Menu} = require('electron')
const path = require('path')

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
    const win = new BrowserWindow({
      width: 200,
      height: 300,
      title: 'Add Item',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('addWindow.html')
};


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
                label: 'Esci',
                accelerator: process.platform == 'darwin' ? 'Coomand+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]