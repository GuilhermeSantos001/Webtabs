/**
 * Import
 */
const [
    {
        ipcMain,
        Menu
    }
] = [
        require('electron')
    ];
/**
 * Variables
 */
const [
    templateMainPath
] = [
        '../menus/template/main'
    ]
ipcMain
    .on('menu_started', () => {
        /**
         * Import
         */
        let template = require(templateMainPath);

        /**
         * Extensions remove
         */

        /**
         * D-Guard
         */
        if (template[3].submenu[0]) {
            template[3].submenu.splice(0, 1);
        }

        /**
         * Process
         */
        const menu = Menu.buildFromTemplate(require(templateMainPath));
        Menu.setApplicationMenu(menu);
    })
    .on('extensions_dguard_menu_update', (event, items) => {
        /**
         * Import
         */
        let template = require(templateMainPath);

        /**
         * D-Guard append
         */
        if (template[3].submenu.filter(item => {
            return item.label === 'D-Guard';
        }).length > 0) template[3].submenu.splice(0, 1);
        template[3].submenu.splice(0, 0, {
            label: 'D-Guard',
            submenu: [
                {
                    label: 'Conta',
                    accelerator: 'CommandOrControl+F9',
                    click: () => {
                        event.sender.send('extensions_dguard_window_configs');
                    }
                },
                {
                    label: 'Cameras',
                    submenu: []
                }
            ]
        });
        if (items.length > 0) {
            items.splice(0, 0, {
                label: 'Layout',
                submenu: [
                    {
                        label: '1 Camera',
                        id: 'layout_1',
                        type: 'radio',
                        checked: false,
                        click: () => {
                            event.sender.send('extension_dguard', String('layout_1'));
                        }
                    },
                    {
                        label: '4 Cameras',
                        id: 'layout_2',
                        type: 'radio',
                        checked: false,
                        click: () => {
                            event.sender.send('extension_dguard', String('layout_2'));
                        }
                    },
                    {
                        label: '16 Cameras',
                        id: 'layout_3',
                        type: 'radio',
                        checked: false,
                        click: () => {
                            event.sender.send('extension_dguard', String('layout_3'));
                        }
                    }
                ]
            });
            items.map(item => {
                if (String(item.id).indexOf('cam_') != -1) {
                    item.click = () => {
                        event.sender.send('extension_dguard', Number(String(item.id).replace('cam_', '')));
                    }
                }
                template[3].submenu[0].submenu[1].submenu.push(item);
            });
        }
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        event.sender.send('extensions_dguard_menu_update_checked');
    });