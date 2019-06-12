const { app, BrowserWindow, BrowserView } = require('electron')

require('module').globalPaths.push(__dirname + '/node_modules');

let mainWindow;
function createWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize,
    settings = {
      width: width,
      height: height,
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
      content: new BrowserView()
    };

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setBrowserView(view.content);
  viewSetBounds();

  function viewSetBounds() {
    let delay = setTimeout(() => {
      anchorX = Math.floor((16 * mainWindow.getContentBounds().width) / 100) + 10,
        view.settings = {
          x: anchorX,
          y: 0,
          width: mainWindow.getContentBounds().width - anchorX,
          height: mainWindow.getContentBounds().height
        }
      view.content.setBounds(view.settings);
      clearTimeout(delay);
    });

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
      });
  }

  mainWindow
    .on('enter-full-screen', () => {
      viewSetBounds();
    })
    .on('leave-full-screen', () => {
      viewSetBounds();
    })
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});

/**
 * PROCESS
 */
require('./import/LRP');