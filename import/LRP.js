/**
 * Listen Renderer Process
 */
const { ipcMain } = require('electron');

/**
 * Variable
 */
const fs = require('fs');
const path = require('../import/LocalPath');
var settings = {
    geral: require('../settings/geral')
}

/**
 * Listeners
 */
ipcMain.on('settings_update', (event, args) => {
    switch (args[0]) {
        case 'timepage':
            settings.geral.timepage = Number(args[1]);
            break;
        case 'zoompage':
            settings.geral.zoompage = Number(args[1]);
            break;
        case 'fullscreen':
            settings.geral.fullscreen = Boolean(args[1]);
            break;
    }
    fs.writeFileSync(path.resolve('settings\\geral.json'),
        JSON.stringify(settings.geral, null, 2));
});

ipcMain.on('debug', (event, args) => {
    console.log(args);
});