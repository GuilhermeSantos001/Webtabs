/**
 * Variables
 */
const [{
    app,
    BrowserWindow,
    screen,
    Menu
  },
  DeveloperMode
] = [
  require('electron'),
  require('./bin/import/DeveloperMode')
];

/**
 * Process
 */

/**
 * Variables
 */
let mainWindow;

/**
 * Functions
 */
function createWindow() {
  let path = require('./bin/import/localPath'),
    fs = require('fs'),
    file = path.localPath('configs/display.json'),
    selected = 0;
  if (fs.existsSync(file)) {
    selected = (data => {
      if (data.selected != undefined) return data.selected;
      return 0;
    })(JSON.parse(fs.readFileSync(file, 'utf-8')) || {});
  }
  const displays = screen.getAllDisplays();
  while (!displays[selected]) {
    if (selected > 0)
      selected--;
  }

  const {
    width,
    height
  } = displays[selected].workAreaSize, {
    x,
    y
  } = displays[selected].workArea;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: width / 2,
    minHeight: height / 2,
    x: x,
    y: y,
    webPreferences: {
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webviewTag: true,
      webSecurity: false,
      enableRemoteModule: true
    }
  })

  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile('index.html');
  mainWindow.maximize();

  if (DeveloperMode.getStatus()) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  });
};

/**
 * Events
 */
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});

/**
 * Import Modules
 */
require('./bin/events/main');