// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  screen,
  Menu,
  ipcMain
} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: width / 2,
    minHeight: height / 2,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      webSecurity: false
    }
  })

  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow
    .on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
    .on('dom-ready', function () {
      console.log('teste');
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});

ipcMain
  .on('menu_started', () => {
    /**
     * Import
     */
    let template = require('./bin/menus/template/main');

    /**
     * Extensions remove
     */

    /**
     * D-Guard
     */
    if (template[3].submenu[0]) {
      template[3].submenu.splice(0, 1);
    }

    /**
     * Process
     */
    const menu = Menu.buildFromTemplate(require('./bin/menus/template/main'));
    Menu.setApplicationMenu(menu);
  })
  .on('extensions_dguard_menu_update', (event, items) => {
    /**
     * Import
     */
    let template = require('./bin/menus/template/main');

    /**
     * D-Guard append
     */
    template[3].submenu.splice(0, 0, {
      label: 'D-Guard',
      submenu: [
        {
          label: 'Conta',
          accelerator: 'CommandOrControl+F9',
          click: () => {
            event.sender.send('extensions_dguard_window_configs');
          }
        },
        {
          label: 'Cameras',
          submenu: []
        }
      ]
    });

    if (items.length > 0) {
      items.splice(0, 0, {
        label: 'Layout',
        submenu: [
          {
            label: '1 Camera',
            id: 'layout_1',
            type: 'radio',
            checked: false,
            click: () => {
              event.sender.send('extension_dguard', String('layout_1'));
            }
          },
          {
            label: '4 Cameras',
            id: 'layout_2',
            type: 'radio',
            checked: false,
            click: () => {
              event.sender.send('extension_dguard', String('layout_2'));
            }
          },
          {
            label: '16 Cameras',
            id: 'layout_3',
            type: 'radio',
            checked: false,
            click: () => {
              event.sender.send('extension_dguard', String('layout_3'));
            }
          }
        ]
      });

      items.map(item => {
        if (String(item.id).indexOf('cam_') != -1)
          item.click = () => {
            event.sender.send('extension_dguard', Number(String(item.id).replace('cam_', '')));
          }
        template[3].submenu[0].submenu[1].submenu.push(item);
      });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    event.sender.send('extensions_dguard_menu_update_checked');
  });