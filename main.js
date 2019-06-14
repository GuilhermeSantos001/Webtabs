const { app, BrowserWindow, BrowserView, Menu, globalShortcut } = require('electron');
const path = require(__dirname + '/import/LocalPath');

require('module').globalPaths.push(path.resolve('node_modules'));

let mainWindow;
function createWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize,
    settings = {
      width: width,
      height: height,
      icon: path.resolve('icon.ico'),
      resizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    };

  mainWindow = new BrowserWindow(settings);

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  var anchorX = Math.floor((16 * mainWindow.getContentBounds().width) / 100),
    view = {
      content: new BrowserView(),
      hide: false
    }; viewSetBounds();

  const menu = Menu.buildFromTemplate([
    {
      id: "menuback",
      label: "Voltar"
    }
  ]);
  menu.getMenuItemById('menuback').click = () => {
    viewSetBounds();
    mainWindow.webContents.send('menushow');
    mainWindow.setMenuBarVisibility(false);
  };
  Menu.setApplicationMenu(menu);

  globalShortcut
    .register('CommandOrControl+B', () => {
      if (!view.hide) return;
      if (mainWindow.isMenuBarVisible())
        mainWindow.setMenuBarVisibility(false), viewSetBounds(true);
      else
        mainWindow.setMenuBarVisibility(true), viewSetBounds(true);
    })
  globalShortcut
    .register('F11', () => {
      if (mainWindow.isFullScreen())
        mainWindow.setFullScreen(false),
          mainWindow.webContents.send('togglefullscreen', false);
      else
        mainWindow.setFullScreen(true),
          mainWindow.webContents.send('togglefullscreen', true);
    });
  globalShortcut
    .register('CommandOrControl+R', () => {
      if (!view.hide)
        mainWindow.reload(), view.content.webContents.reload();
      else
        view.content.webContents.reload();
    });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setBrowserView(view.content);

  function viewSetBounds(fullsize) {
    let delay = setTimeout(() => {
      if (!fullsize)
        anchorX = Math.floor((16 * mainWindow.getContentBounds().width) / 100) + 10,
          view.settings = {
            x: anchorX,
            y: 0,
            width: mainWindow.getContentBounds().width - anchorX,
            height: mainWindow.getContentBounds().height
          },
          view.hide = false;
      else
        view.settings = {
          x: 0,
          y: 0,
          width: mainWindow.getContentBounds().width,
          height: mainWindow.getContentBounds().height
        },
          view.hide = true;
      view.content.setBounds(view.settings);
      clearTimeout(delay);
    });
  };



  require('electron').ipcMain
    .on('updatezoomview', (event, arg) => {
      view.content.webContents.setZoomFactor(arg);
    })
    .on('updatefullscreenview', (event, arg) => {
      mainWindow.setFullScreen(arg);
    })
    .on('updateurlview', (event, arg) => {
      view.content.webContents.loadURL(arg);
    })
    .on('geturlview', event => {
      event.returnValue = view.content.webContents.getURL();
    })
    .on('menuhide', event => {
      viewSetBounds(true);
      mainWindow.setMenuBarVisibility(true);
    });

  mainWindow
    .on('enter-full-screen', () => {
      if (!view.hide)
        viewSetBounds();
      else
        viewSetBounds(true);
    })
    .on('leave-full-screen', () => {
      if (!view.hide)
        viewSetBounds();
      else
        viewSetBounds(true);
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

/**
 * IMPORT PROCESS
 */
require('./import/LRP');