/**
 * Variables
 */
let [{
    remote,
    Menu
}] = [
    require('electron')
];

/**
 * Class
 */
class DeveloperMode {
    constructor() {
        this.status = require('electron-is-dev');
    }
    getStatus() {
        return this.status;
    }
    getDevToolsDeveloperMode() {
        if (
            remote &&
            remote.Menu
        ) {
            if (remote.Menu.getApplicationMenu().getMenuItemById('devtools_developerMode'))
                return remote.Menu.getApplicationMenu().getMenuItemById('devtools_developerMode').checked;
        } else {
            if (Menu.getApplicationMenu().getMenuItemById('devtools_developerMode'))
                return Menu.getApplicationMenu().getMenuItemById('devtools_developerMode').checked;
        }
    }
}

module.exports = new DeveloperMode();