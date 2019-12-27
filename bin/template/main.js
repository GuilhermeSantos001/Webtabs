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
                            mainWindow.setMenuBarVisibility(true);
                            mainWindow.setAutoHideMenuBar(false);
                        }
                    },
                    {
                        label: 'Ocultar',
                        accelerator: 'CommandOrControl+F1',
                        click: () => {
                            mainWindow.setMenuBarVisibility(false);
                            mainWindow.setAutoHideMenuBar(true);
                        }
                    }
                ]
            },
            { label: 'Fechar', role: 'close' }
        ]
    },
    {
        label: 'Exibição', submenu: [
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
                    mainWindow.webContents.send('window_configs_urls');
                }
            },
            {
                label: 'Configurações',
                accelerator: 'F10',
                click: () => {
                    mainWindow.webContents.send('window_configs_global');
                }
            },
            {
                label: 'Mouse',
                submenu: [
                    {
                        label: 'Exibir',
                        accelerator: 'Shift+F2',
                        click: () => {
                            mainWindow.webContents.send('window_show_cursor');
                        }
                    },
                    {
                        label: 'Ocultar',
                        accelerator: 'CommandOrControl+F2',
                        click: () => {
                            mainWindow.webContents.send('window_hide_cursor');
                        }
                    }
                ]
            },
            {
                label: 'Barra de Rolagem', submenu: [
                    {
                        label: 'Exibir',
                        click: () => {
                            mainWindow.webContents.send('show_scroll_page');
                        }
                    },
                    {
                        label: 'Ocultar',
                        click: () => {
                            mainWindow.webContents.send('hide_scroll_page');
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
                            mainWindow.webContents.send('render_resetZoom');
                        }
                    },
                    {
                        label: 'Aumentar Zoom',
                        accelerator: 'CommandOrControl+numadd',
                        click: () => {
                            mainWindow.webContents.send('render_increaseZoom');
                        }
                    },
                    {
                        label: 'Dimuir Zoom',
                        accelerator: 'CommandOrControl+numsub',
                        click: () => {
                            mainWindow.webContents.send('render_reduceZoom');
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
                            mainWindow.webContents.send('render_next');
                        }
                    },
                    {
                        label: '...Anterior',
                        accelerator: 'CommandOrControl+Left',
                        click: () => {
                            mainWindow.webContents.send('render_return');
                        }
                    }
                ]
            }
        ]
    }
];

module.exports = template;