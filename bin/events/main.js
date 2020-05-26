/**
 * Import
 */
const [{
    ipcMain,
    Menu
}] = [
    require('electron')
];
/**
 * Variables
 */
const [
    templateMain
] = [
    require('../menus/template/main')
]
ipcMain
    .on('menu_started', () => {
        /**
         * Import
         */
        let template = new templateMain();

        /**
         * Extensions remove
         */

        /**
         * D-Guard
         */
        let indexOf;
        template.layout[3].submenu.map((item, i) => {
            if (item.label === 'D-Guard') return indexOf = i;
        });
        if (indexOf >= 0) template.layout[3].submenu.splice(indexOf, 1);

        /**
         * Process
         */
        const menu = Menu.buildFromTemplate(template.layout);
        Menu.setApplicationMenu(menu);
    })
    .on('extensions_dguard_menu_update', (event, items) => {
        /**
         * Import
         */
        let template = new templateMain();

        /**
         * D-Guard append
         */
        let indexOf;
        template.layout[3].submenu.map((item, i) => {
            if (item.label === 'D-Guard') return indexOf = i;
        });
        if (indexOf >= 0) template.layout[3].submenu.splice(indexOf, 1);

        template.layout[3].submenu.splice(0, 0, {
            label: 'D-Guard',
            submenu: [{
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
                submenu: [{
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
                template.layout[3].submenu[0].submenu[1].submenu.push(item);
            });
        }
        const menu = Menu.buildFromTemplate(template.layout);
        Menu.setApplicationMenu(menu);
        event.sender.send('extensions_dguard_menu_update_checked');
    })
    .on('extensions_dguard_menu_close', () => {
        /**
         * Import
         */
        let template = new templateMain();

        /**
         * D-Guard
         */
        let indexOf;
        template.layout[3].submenu.map((item, i) => {
            if (item.label === 'D-Guard') return indexOf = i;
        });
        if (indexOf >= 0) template.layout[3].submenu.splice(indexOf, 1);

        /**
         * Process
         */
        const menu = Menu.buildFromTemplate(template.layout);
        Menu.setApplicationMenu(menu);
    });