const { app, BrowserWindow, BrowserView, globalShortcut } = require('electron');
const path = require(__dirname + '/import/LocalPath'),
  system = {
    settings: {
      geral: require(path.resolve('settings/geral'))
    }
  }

require('module').globalPaths.push(path.resolve('node_modules'));

let mainWindow;
function createWindow() {
  while (require('electron').screen.getAllDisplays()[system.settings.geral.display] === undefined) {
    system.settings.geral.display--;
    if (require('electron').screen.getAllDisplays()[system.settings.geral.display] != undefined)
      require('fs').writeFileSync(path.resolve('settings\\geral.json'),
        JSON.stringify(system.settings.geral, null, 2));
  }
  const { width, height } = require('electron').screen.getAllDisplays()[system.settings.geral.display].workAreaSize,
    { x, y } = require('electron').screen.getAllDisplays()[system.settings.geral.display].workArea,
    settings = {
      width: width,
      height: height,
      x: x,
      y: y,
      icon: path.resolve('img/icon.ico'),
      webPreferences: {
        nodeIntegration: true
      }
    };

  mainWindow = new BrowserWindow(settings);

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  var view = {
    content: new BrowserView(),
    hide: false
  };

  globalShortcut
    .register('CommandOrControl+W', () => {
      app.quit();
    });
  globalShortcut
    .register('CommandOrControl+B', () => {
      if (!system.settings.geral.menu.visible)
        mainWindow.webContents.send('menushow'), viewSetBounds();
      else
        mainWindow.webContents.send('menuhide');
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

  mainWindow.removeMenu();
  mainWindow.setBrowserView(view.content);

  function viewSetBounds(fullsize) {
    mainWindow.setBounds({ width: width, height: height, x: x, y: y });
    mainWindow.setMaximizable(true);
    mainWindow.maximize();
    mainWindow.setMaximizable(false);
    if (view.display != system.settings.geral.display) {
      view.display = system.settings.geral.display;
      view.width = mainWindow.getContentBounds().width;
      view.height = mainWindow.getContentBounds().height;
    }
    if (!fullsize) {
      var anchorX = Math.floor((16 * view.width) / 100) + 10;
      view.settings = {
        x: anchorX,
        y: 0,
        width: view.width - anchorX,
        height: view.height
      },
        view.hide = false;
    }
    else {
      view.settings = {
        x: 0,
        y: 0,
        width: mainWindow.getContentBounds().width,
        height: mainWindow.getContentBounds().height
      },
        view.hide = true;
    }
    view.content.setBounds(view.settings);
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