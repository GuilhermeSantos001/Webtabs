/**
 * Variables
 */
let [
    {
        remote,
        Menu
    }
] = [
        require('electron')
    ];

function _isDev() {
    if (require('electron-is-dev')) return true;
    if (
        remote &&
        remote.Menu
    ) {
        if (remote.Menu.getApplicationMenu().getMenuItemById('devtools_developerMode'))
            return remote.Menu.getApplicationMenu().getMenuItemById('devtools_developerMode').checked;
    }
    else {
        if (Menu.getApplicationMenu().getMenuItemById('devtools_developerMode'))
            return Menu.getApplicationMenu().getMenuItemById('devtools_developerMode').checked;
    }
}

module.exports = _isDev;