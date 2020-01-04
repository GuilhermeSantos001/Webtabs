const [
    { BrowserWindow }
] = [
        require('electron')
    ];

const template = [{
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
    submenu: []
}];

module.exports = template;