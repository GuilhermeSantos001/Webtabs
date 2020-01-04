/**
 * Import
 */
const [
    {
        BrowserWindow
    }
] = [
        require('electron')
    ]

const template = [
    {
        label: 'Janela', submenu: [
            { label: 'Tela Cheia', role: 'togglefullscreen' },
            { role: 'toggleDevTools' },
            { label: 'Recarregar', role: 'reload' },
            {
                label: 'Barra de menu',
                submenu: [
                    {
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
            { label: 'Fechar', role: 'close' }
        ]
    },
    {
        label: 'Exibição',
        submenu: [
            { label: 'Executar', type: 'radio', checked: true },
            { id: 'PAUSE', label: 'Pausar', type: 'radio' }
        ]
    },
    {
        label: 'Frame', submenu: [
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
                submenu: [
                    {
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
                label: 'Barra de Rolagem', submenu: [
                    {
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
                label: 'Zoom', submenu: [
                    {
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
                label: 'Transição', submenu: [
                    {
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
        submenu: [
            {
                label: 'D-Guard',
                submenu: [
                    {
                        label: 'Conta',
                        accelerator: 'CommandOrControlOrShift+F9',
                        click: () => {
                            BrowserWindow.getFocusedWindow().webContents.send('extensions_dguard_window_configs');
                        }
                    },
                    {
                        label: 'Câmeras',
                        submenu: [
                            {
                                label: 'Layout',
                                submenu: [
                                    {
                                        label: '1 Câmera',
                                        id: 'layout_1',
                                        type: 'radio',
                                        checked: false,
                                        click: () => {
                                            BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', "layout_1");
                                        }
                                    },
                                    {
                                        label: '4 Câmeras',
                                        id: 'layout_2',
                                        type: 'radio',
                                        checked: false,
                                        click: () => {
                                            BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', "layout_2");
                                        }
                                    },
                                    {
                                        label: '16 Câmeras',
                                        id: 'layout_3',
                                        type: 'radio',
                                        checked: false,
                                        click: () => {
                                            BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', "layout_3");
                                        }
                                    }
                                ]
                            },
                            {
                                label: '0054 - KOLPING',
                                id: 'cam_0',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 0);
                                }
                            },
                            {
                                label: '0042 - SABÓ LAPA',
                                id: 'cam_1',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 1);
                                }
                            },
                            {
                                label: '0006 - Drava Metais',
                                id: 'cam_2',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 2);
                                }
                            },
                            {
                                label: 'BASE MAVE 1',
                                id: 'cam_3',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 3);
                                }
                            },
                            {
                                label: 'V. MAVE 1',
                                id: 'cam_4',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 4);
                                }
                            },
                            {
                                label: 'BASE MAVE 2',
                                id: 'cam_5',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 5);
                                }
                            },
                            {
                                label: 'MONITOR 1',
                                id: 'cam_6',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 6);
                                }
                            },
                            {
                                label: '0053 - FORRESTPARK',
                                id: 'cam_7',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 7);
                                }
                            },
                            {
                                label: 'V. MAVE 2',
                                id: 'cam_8',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 8);
                                }
                            },
                            {
                                label: '0031 - CLINICA ERGO',
                                id: 'cam_9',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 9);
                                }
                            },
                            {
                                label: '0067 - SUMARÉ',
                                id: 'cam_10',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 10);
                                }
                            },
                            {
                                label: '0004 - PRESTIGE',
                                id: 'cam_11',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 11);
                                }
                            },
                            {
                                label: '0007 - FOCUS',
                                id: 'cam_12',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 12);
                                }
                            },
                            {
                                label: 'MONITOR 3',
                                id: 'cam_13',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 13);
                                }
                            },
                            {
                                label: '0064 - LEXUS',
                                id: 'cam_14',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 14);
                                }
                            },
                            {
                                label: '0068 - RESIDENCIA RENATA',
                                id: 'cam_15',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 15);
                                }
                            },
                            {
                                label: '0017 - DRASTOSA ATALIBA',
                                id: 'cam_16',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 16);
                                }
                            },
                            {
                                label: 'MONITOR 2',
                                id: 'cam_17',
                                type: 'radio',
                                checked: false,
                                click: () => {
                                    BrowserWindow.getFocusedWindow().webContents.send('extension_dguard', 17);
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

module.exports = template;