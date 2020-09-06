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
    cacheMenu,
    controller
] = [
    require('electron'),
    require('../../import/localPath'),
    require('fs'),
    require('../data/main'),
    require('../../import/controller')
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
        data_menu = JSON.parse(fs.readFileSync(path.localPath('storage/menus/main.json'), 'utf-8')) || {
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
        fs.writeFileSync(path.localPath('storage/menus/main.json'), Buffer.from(JSON.stringify(data_menu), 'utf-8'), {
            flag: 'w+'
        });
    }
};

function saveData() {
    let file = path.localPath('storage/menus/main.json');
    if (path.localPathExists('storage/menus/main.json')) {
        fs.writeFileSync(file, Buffer.from(JSON.stringify(data_menu), 'utf-8'), {
            flag: 'w+'
        });
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
            data_menu = JSON.parse(fs.readFileSync(path.localPath('storage/menus/main.json'), 'utf-8')) || {
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
                            data = JSON.parse(fs.readFileSync(file, 'utf-8')) || {};
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
                                        fs.writeFileSync(file, Buffer.from(JSON.stringify(data), 'utf-8'), {
                                            flag: 'w+'
                                        });
                                        if (isFullScreen) win.setFullScreen(true);
                                        clearTimeout(delay);
                                    }, 100);
                                }
                            }
                        });
                        fs.writeFileSync(file, Buffer.from(JSON.stringify(data), 'utf-8'), {
                            flag: 'w+'
                        });
                        return data.displays;
                    })(screen.getAllDisplays())
                },
                {
                    label: 'DevTools',
                    submenu: [{
                            id: 'devtools_developerMode',
                            label: 'Exibir mensagens de depuração',
                            type: 'checkbox',
                            checked: (() => {
                                return cacheMenu.getDeveloperToolsModeValue('show_debug_messages');
                            })(),
                            click: (menuItem) => {
                                if (menuItem.checked) {
                                    cacheMenu.setDeveloperToolsModeValue('show_debug_messages', true);
                                } else {
                                    cacheMenu.setDeveloperToolsModeValue('show_debug_messages', false);
                                }
                            }
                        },
                        {
                            label: 'Escolha o que será exibido',
                            submenu: [{
                                    id: 'start_frame',
                                    label: 'Exibir a mensagem de inicialização do sistema',
                                    type: 'checkbox',
                                    checked: (() => {
                                        return cacheMenu.getDeveloperToolsModeValue('start_frame');
                                    })(),
                                    click: (menuItem) => {
                                        if (menuItem.checked) {
                                            cacheMenu.setDeveloperToolsModeValue('start_frame', true);
                                        } else {
                                            cacheMenu.setDeveloperToolsModeValue('start_frame', false);
                                        }
                                    }
                                },
                                {
                                    id: 'append_frames',
                                    label: 'Exibir as mensagens de inicialização dos frames',
                                    type: 'checkbox',
                                    checked: (() => {
                                        return cacheMenu.getDeveloperToolsModeValue('append_frames');
                                    })(),
                                    click: (menuItem) => {
                                        if (menuItem.checked) {
                                            cacheMenu.setDeveloperToolsModeValue('append_frames', true);
                                        } else {
                                            cacheMenu.setDeveloperToolsModeValue('append_frames', false);
                                        }
                                    }
                                },
                                {
                                    id: 'remove_frames',
                                    label: 'Exibir as mensagens de remoção dos frames',
                                    type: 'checkbox',
                                    checked: (() => {
                                        return cacheMenu.getDeveloperToolsModeValue('remove_frames');
                                    })(),
                                    click: (menuItem) => {
                                        if (menuItem.checked) {
                                            cacheMenu.setDeveloperToolsModeValue('remove_frames', true);
                                        } else {
                                            cacheMenu.setDeveloperToolsModeValue('remove_frames', false);
                                        }
                                    }
                                },
                                {
                                    id: 'tick_frames',
                                    label: 'Exibir o tempo de transição entre os frames',
                                    type: 'checkbox',
                                    checked: (() => {
                                        return cacheMenu.getDeveloperToolsModeValue('tick_frames');
                                    })(),
                                    click: (menuItem) => {
                                        if (menuItem.checked) {
                                            cacheMenu.setDeveloperToolsModeValue('tick_frames', true);
                                        } else {
                                            cacheMenu.setDeveloperToolsModeValue('tick_frames', false);
                                        }
                                    }
                                },
                                {
                                    id: 'pause_frames',
                                    label: 'Exibir a mensagem de pausa',
                                    type: 'checkbox',
                                    checked: (() => {
                                        return cacheMenu.getDeveloperToolsModeValue('pause_frames');
                                    })(),
                                    click: (menuItem) => {
                                        if (menuItem.checked) {
                                            cacheMenu.setDeveloperToolsModeValue('pause_frames', true);
                                        } else {
                                            cacheMenu.setDeveloperToolsModeValue('pause_frames', false);
                                        }
                                    }
                                },
                                {
                                    id: 'errors_system',
                                    label: 'Exibir as mensagens de erro',
                                    type: 'checkbox',
                                    checked: (() => {
                                        return cacheMenu.getDeveloperToolsModeValue('errors_system');
                                    })(),
                                    click: (menuItem) => {
                                        if (menuItem.checked) {
                                            cacheMenu.setDeveloperToolsModeValue('errors_system', true);
                                        } else {
                                            cacheMenu.setDeveloperToolsModeValue('errors_system', false);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            role: 'toggleDevTools'
                        }
                    ]
                },
                {
                    id: 'system_tooglereload',
                    label: 'Recarregar',
                    accelerator: 'CommandOrControl+R',
                    click: () => {
                        require('electron').app.relaunch({
                            args: process.argv.slice(1).concat(['--relaunch'])
                        })
                        require('electron').app.exit(0)
                    }
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
                    label: 'Janela de registro de mudanças',
                    submenu: [{
                            id: 'changelog_show',
                            label: 'Permitida',
                            type: 'radio',
                            checked: (() => {
                                return cacheMenu.getChangelogValue('show');
                            })(),
                            click: (menuItem) => {
                                if (menuItem.checked) {
                                    cacheMenu.setChangelogValue('show', true);
                                }
                            }
                        },
                        {
                            id: 'changelog_show',
                            label: 'Desativada',
                            type: 'radio',
                            checked: (() => {
                                return !cacheMenu.getChangelogValue('show');
                            })(),
                            click: (menuItem) => {
                                if (menuItem.checked) {
                                    cacheMenu.setChangelogValue('show', false);
                                }
                            }
                        }
                    ]
                },
                {
                    label: 'Comados do controle online',
                    submenu: [{
                            id: 'commands_controllerOnline_activated',
                            label: 'Ativado',
                            type: 'radio',
                            checked: (() => {
                                return cacheMenu.getControllerOnlineValue('activated');
                            })(),
                            click: (menuItem) => {
                                if (menuItem.checked) {
                                    cacheMenu.setControllerOnlineValue('activated', true);
                                }
                            }
                        },
                        {
                            id: 'commands_controllerOnline_deactivated',
                            label: 'Desativado',
                            type: 'radio',
                            checked: (() => {
                                return !cacheMenu.getControllerOnlineValue('activated');
                            })(),
                            click: (menuItem) => {
                                if (menuItem.checked) {
                                    cacheMenu.setControllerOnlineValue('activated', false);
                                }
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
                    id: 'frame_running',
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
                        if (!controller.frameEmpty())
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
        },
        {
            label: 'Ajuda',
            submenu: []
        },
        {
            label: 'Sobre',
            submenu: [{
                    label: 'Ver a versão atual',
                    accelerator: 'CommandOrControl+F10',
                    click: () => {
                        BrowserWindow.getFocusedWindow().webContents.send('window_frame_show_info_system');
                    }
                },
                {
                    label: 'Mostrar o registro de mudanças',
                    accelerator: 'CommandOrControl+F11',
                    click: () => {
                        BrowserWindow.getFocusedWindow().webContents.send('changelog_reset_registry');
                    }
                }
            ]
        }
    ]
}

module.exports = Template;