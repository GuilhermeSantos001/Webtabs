/**
 * Listen Renderer Process
 */
const { ipcMain } = require('electron');

/**
 * Variable
 */
const fs = require('fs');
const path = require('./LocalPath');
var settings = {
    geral: require(path.resolve('settings/geral.json'))
}

/**
 * Listeners
 */
ipcMain.on('settings_update', (event, args) => {
    let reload = false;
    switch (args[0]) {
        case 'display':
            settings.geral.display = Number(args[1]);
            reload = true;
            break;
        case 'timepage':
            settings.geral.timepage = Number(args[1]);
            break;
        case 'zoompage':
            settings.geral.zoompage = Number(args[1]);
            break;
        case 'fullscreen':
            settings.geral.fullscreen = Boolean(args[1]);
            break;
        case 'menu_visible':
            settings.geral.menu.visible = Boolean(args[1]);
            break;
    }
    fs.writeFileSync(path.resolve('settings\\geral.json'),
        JSON.stringify(settings.geral, null, 2));
    if (reload) {
        require('electron').app.relaunch();
        require('electron').app.exit(0);
    }
});

ipcMain.on('debug', (event, args) => {
    console.log(args);
});