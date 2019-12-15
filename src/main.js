const { app, screen, Menu, BrowserWindow } = require('electron');
const THISDEVELOPMENT = require('electron-is-dev');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const template = [
    {
      label: 'Janela', submenu: [
        { label: 'Tela Cheia', role: 'togglefullscreen' },
        { role: 'toggleDevTools' },
        { label: 'Recarregar', role: 'reload' },
        { label: 'Fechar', role: 'close' }
      ]
    },
    {
      label: 'Exibição', submenu: [
        { label: 'Executar', type: 'radio', checked: true },
        { id: 'PAUSE', label: 'Pausar', type: 'radio' }
      ]
    },
    {
      label: 'Frame', submenu: [
        {
          label: 'Abrir o menu de ações',
          accelerator: 'F9',
          click: () => {
            mainWindow.webContents.send('window_configs_urls');
          }
        },
        {
          label: 'Configurações',
          accelerator: 'F10',
          click: () => {
            mainWindow.webContents.send('window_configs_global');
          }
        },
        {
          label: 'Barra de Rolagem', submenu: [
            {
              label: 'Exibir',
              click: () => {
                mainWindow.webContents.send('show_scroll_page');
              }
            },
            {
              label: 'Ocultar',
              click: () => {
                mainWindow.webContents.send('hide_scroll_page');
              }
            }
          ]
        },
        {
          label: 'Zoom', submenu: [
            {
              label: 'Resetar Zoom',
              accelerator: 'CommandOrControl+nummult',
              click: () => {
                mainWindow.webContents.send('render_resetZoom');
              }
            },
            {
              label: 'Aumentar Zoom',
              accelerator: 'CommandOrControl+numadd',
              click: () => {
                mainWindow.webContents.send('render_increaseZoom');
              }
            },
            {
              label: 'Dimuir Zoom',
              accelerator: 'CommandOrControl+numsub',
              click: () => {
                mainWindow.webContents.send('render_reduceZoom');
              }
            }
          ]
        },
        {
          label: 'Transição', submenu: [
            {
              label: 'Proximo...',
              accelerator: 'CommandOrControl+Right',
              click: () => {
                mainWindow.webContents.send('render_next');
              }
            },
            {
              label: '...Anterior',
              accelerator: 'CommandOrControl+Left',
              click: () => {
                mainWindow.webContents.send('render_return');
              }
            }
          ]
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  // Create the browser window.
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
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (THISDEVELOPMENT) mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.