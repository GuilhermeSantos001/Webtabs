/**
 * Import
 */
const [{
        BrowserWindow,
        screen,
        Menu
    },
    path,
    fs,
    cacheMenu
] = [
    require('electron'),
    require('../../import/localPath'),
    require('fs'),
    require('../data/main')
];

/**
 * Variables
 */
let [
    data_menu
] = [
    null
];

/**
 * SCI ▲
 * 
 * Self Callers Initialize
 */
createData();

/**
 * Functions
 */
function createData() {
    if (!path.localPathExists('storage/menus/main.json')) path.localPathCreate('storage/menus/main.json');
    if (fs.existsSync(path.localPath('storage/menus/main.json'))) {
        data_menu = JSON.parse(fs.readFileSync(path.localPath('storage/menus/main.json'), 'utf8')) || {
            devtools: {
                developermode: require('electron-is-dev')
            }
        }
    } else {
        data_menu = {
            devtools: {
                developermode: require('electron-is-dev')
            }
        }
        fs.writeFileSync(path.localPath('storage/menus/main.json'), JSON.stringify(data_menu, null, 2), 'utf8');
    }
};

function saveData() {
    let file = path.localPath('storage/menus/main.json');
    if (path.localPathExists('storage/menus/main.json')) {
        fs.writeFileSync(file, JSON.stringify(data_menu, null, 2), 'utf8');
    }
};

/**
 * Class
 */
class Template {
    constructor() {
        this.loadData();
    }
    loadData() {
        if (fs.existsSync(path.localPath('storage/menus/main.json'))) {
            data_menu = JSON.parse(fs.readFileSync(path.localPath('storage/menus/main.json'), 'utf8')) || {
                devtools: {
                    developermode: require('electron-is-dev')
                }
            }
        }
        this.data = data_menu;
    }

    layout = [{
            label: 'Janela',
            submenu: [{
                    label: 'Tela Cheia',
                    role: 'togglefullscreen'
                },
                {
                    label: 'Monitor de Saida',
                    submenu: (displays => {
                        let file = path.localPath('configs/display.json'),
                            data;
                        if (!path.localPathExists('configs/display.json')) path.localPathCreate('configs/display.json');
                        if (fs.existsSync(file)) {
                            data = JSON.parse(fs.readFileSync(file, 'utf8')) || {};
                        } else {
                            data = {
                                selected: 0
                            }
                        }
                        while (!displays[data.selected]) {
                            if (data.selected > 0)
                                data.selected--;
                        }
                        data.displays = displays.map((display, i) => {
                            return {
                                label: `Monitor ${i + 1}`,
                                type: 'radio',
                                checked: i == data.selected,
                                click: menuItem => {
                                    data.selected = Number(menuItem.label.replace('Monitor', '')), data.selected--;
                                    let {
                                        x,
                                        y,
                                        width,
                                        height
                                    } = display.bounds,
                                        win = BrowserWindow.getFocusedWindow(),
                                        isFullScreen = win.isFullScreen();
                                    if (isFullScreen) win.setFullScreen(false);
                                    let delay = setTimeout(() => {
                                        win.setBounds({
                                            x,
                                            y,
                                            width,
                                            height
                                        });
                                        fs.writeFile(file, JSON.stringify(data, null, 2), e => {
                                            if (isFullScreen) win.setFullScreen(true);
                                            clearTimeout(delay);
                                        });
                                    }, 100);
                                }
                            }
                        });
                        fs.writeFileSync(file, JSON.stringify(data, null, 2));
                        return data.displays;
                    })(screen.getAllDisplays())
                },
                {
                    label: 'DevTools',
                    submenu: [{
                            id: 'devtools_developerMode',
                            label: 'Exibir mensagens de depuração',
                            type: 'checkbox',
                            checked: data_menu['devtools']['developermode'],
                            click: () => {
                                data_menu['devtools']['developermode'] = Menu.getApplicationMenu().getMenuItemById('devtools_developerMode').checked;
                                saveData();
                            }
                        },
                        {
                            role: 'toggleDevTools'
                        }
                    ]
                },
                {
                    label: 'Recarregar',
                    role: 'reload'
                },
                {
                    label: 'Barra de menu',
                    submenu: [{
                            label: 'Exibir',
                            accelerator: 'Shift+F1',
                            click: () => {
                                BrowserWindow.getFocusedWindow().setMenuBarVisibility(true);
                                BrowserWindow.getFocusedWindow().setAutoHideMenuBar(false);
                            }
                        },
                        {
                            label: 'Ocultar',
                            accelerator: 'CommandOrControl+F1',
                            click: () => {
                                BrowserWindow.getFocusedWindow().setMenuBarVisibility(false);
                                BrowserWindow.getFocusedWindow().setAutoHideMenuBar(true);
                            }
                        }
                    ]
                },
                {
                    label: 'Fechar',
                    role: 'close'
                }
            ]
        },
        {
            label: 'Exibição',
            submenu: [{
                    label: 'Executar',
                    type: 'radio',
                    checked: (() => {
                        return cacheMenu.getExibitionValue('running');
                    })(),
                    click: (menuItem) => {
                        if (menuItem.checked) {
                            cacheMenu.setExibitionValue('running', true);
                            cacheMenu.setExibitionValue('pause', false);
                        } else {
                            cacheMenu.setExibitionValue('running', false);
                            cacheMenu.setExibitionValue('pause', true);
                        }
                    }
                },
                {
                    id: 'PAUSE',
                    label: 'Pausar',
                    type: 'radio',
                    checked: (() => {
                        return cacheMenu.getExibitionValue('pause');
                    })(),
                    click: (menuItem) => {
                        if (menuItem.checked) {
                            cacheMenu.setExibitionValue('pause', true);
                            cacheMenu.setExibitionValue('running', false);
                        } else {
                            cacheMenu.setExibitionValue('pause', false);
                            cacheMenu.setExibitionValue('running', true);
                        }
                    }
                }
            ]
        },
        {
            label: 'Frame',
            submenu: [{
                    label: 'Gerenciar Conteúdos',
                    accelerator: 'F8',
                    click: () => {
                        BrowserWindow.getFocusedWindow().webContents.send('window_contents_manager');
                    }
                },
                {
                    label: 'Abrir o menu de ações',
                    accelerator: 'F9',
                    click: () => {
                        BrowserWindow.getFocusedWindow().webContents.send('window_configs_urls');
                    }
                },
                {
                    label: 'Configurações',
                    accelerator: 'F10',
                    click: () => {
                        BrowserWindow.getFocusedWindow().webContents.send('window_configs_global');
                    }
                },
                {
                    label: 'Recarregar',
                    accelerator: 'F5',
                    click: () => {
                        BrowserWindow.getFocusedWindow().webContents.send('window_frame_reload');
                    }
                },
                {
                    label: 'Mouse',
                    submenu: [{
                            label: 'Exibir',
                            accelerator: 'Shift+F2',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('window_show_cursor');
                            }
                        },
                        {
                            label: 'Ocultar',
                            accelerator: 'CommandOrControl+F2',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('window_hide_cursor');
                            }
                        }
                    ]
                },
                {
                    label: 'Barra de Rolagem',
                    submenu: [{
                            label: 'Exibir',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('show_scroll_page');
                            }
                        },
                        {
                            label: 'Ocultar',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('hide_scroll_page');
                            }
                        }
                    ]
                },
                {
                    label: 'Zoom',
                    submenu: [{
                            label: 'Resetar Zoom',
                            accelerator: 'CommandOrControl+nummult',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('render_resetZoom');
                            }
                        },
                        {
                            label: 'Aumentar Zoom',
                            accelerator: 'CommandOrControl+numadd',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('render_increaseZoom');
                            }
                        },
                        {
                            label: 'Dimuir Zoom',
                            accelerator: 'CommandOrControl+numsub',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('render_reduceZoom');
                            }
                        }
                    ]
                },
                {
                    label: 'Transição',
                    submenu: [{
                            label: 'Proximo...',
                            accelerator: 'CommandOrControl+Right',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('render_next');
                            }
                        },
                        {
                            label: '...Anterior',
                            accelerator: 'CommandOrControl+Left',
                            click: () => {
                                BrowserWindow.getFocusedWindow().webContents.send('render_return');
                            }
                        }
                    ]
                }
            ]
        },
        {
            label: 'Extensões',
            submenu: []
        }
    ]
}

module.exports = Template;