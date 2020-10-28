const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const {getCurrentWindow, BrowserWindow, Menu, dialog} = electron;
const app = electron.app;
let mainWindow;

//Listen for app to be ready
app.on('ready', function(){
    
    let loading = new BrowserWindow({show: false, frame: false});
    
    
    loading.once('show', () => 
    {
        //Create new window
        mainWindow = new BrowserWindow({show: false});
        mainWindow.webContents.once('dom-ready', () => 
        {
            console.log('main loaded');
            mainWindow.show();
            loading.hide();
            loading.close();
        })
        //Load HTML file into window
        mainWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'mainWindow.html'),
            protocol: 'file:',
            slashes: true
        }));
    })
    loading.loadURL(url.format({
        pathname: path.join(__dirname, 'loading.html'),
        protocol: 'file:',
        slashes: true
    }));
    loading.show();
   
    mainWindow.on('closed', function(){
        app.quit();
    });
    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});



//Create menu template
const mainMenuTemplate = [
    {
        label: 'File', 
        submenu: [
            {
                label: 'Create File or Folder',
                click()
                {
                    let content = "New file created!";
                    dialog.showSaveDialog((filename) => {
                        if(filename === undefined)
                        {
                            console.log('File not created');
                            return;
                        }
                        fs.writeFile(filename, content, (err) => {
                            if(err)
                            {
                                console.log(err.message);
                                return;
                            }
                            mainWindow.reload();
                        });
                    });
                    
                }
                
            },
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click()
                {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Directory',
        submenu: [
            {
                label: 'Delete Directory',
                click()
                {
                    dialog.showOpenDialog({properties: ['openDirectory']},(dirPaths) => {
                        if(dirPaths.length == 0)
                        {
                            console.log('No folder selected');
                        }
                        rimraf.sync(dirPaths[0]);
                    });
                }
            }
        ]
    },
    {
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'Ctrl+I',
                click(item, focusedWindow)
                {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    }

];


