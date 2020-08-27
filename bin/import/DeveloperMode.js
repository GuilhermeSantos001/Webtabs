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
        if (this.getStatus()) return true;
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

    getDevToolsMode(mode) {
        if (
            remote &&
            remote.Menu
        ) {
            if (remote.Menu.getApplicationMenu().getMenuItemById(String('devtools_developerMode'))) {
                if (!remote.Menu.getApplicationMenu().getMenuItemById(String('devtools_developerMode')).checked) {
                    return false;
                }
            } else {
                return false;
            }
            if (remote.Menu.getApplicationMenu().getMenuItemById(String(mode)))
                return remote.Menu.getApplicationMenu().getMenuItemById(String(mode)).checked;
        } else {
            if (Menu.getApplicationMenu().getMenuItemById(String('devtools_developerMode'))) {
                if (!Menu.getApplicationMenu().getMenuItemById(String('devtools_developerMode')).checked) {
                    return false;
                }
            } else {
                return false;
            }
            if (Menu.getApplicationMenu().getMenuItemById(String(mode)))
                return Menu.getApplicationMenu().getMenuItemById(String(mode)).checked;
        }
        return false;
    }

}

module.exports = new DeveloperMode();