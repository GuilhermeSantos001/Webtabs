import * as ConfigEditor from '../config/editor';
import * as Electron from 'electron';

const { BrowserWindow, Menu } = Electron.remote.require('electron');
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Salvar Alterações',
                sublabel: 'O sistema salva de forma automatica as alterações. Porem você queira ter a certeza de que suas alterações foram salvas.',
                click: () => { win.webContents.send('save_changes'); }
            },
            {
                label: 'Aplicar Alterações',
                click: () => {
                    win.close();
                    Electron.remote.getCurrentWindow().reload();
                }
            }
        ]
    }
];
const menu = Menu.buildFromTemplate(template);

Electron.remote.getCurrentWindow().on('close', () => {
    win.close();
});

export default class WindowEditor {
    constructor() {
        this.window;
        this.width = ConfigEditor.WIDTH;
        this.height = ConfigEditor.HEIGTH;
        this.minWidth = ConfigEditor.WIDTH / 2;
        this.minHeight = ConfigEditor.HEIGTH / 2;
        this._open = false;
        this.create();
    }
    create() {
        this.window = new BrowserWindow({
            width: this.width,
            height: this.height,
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true
            }
        });
    }
    open() {
        let win = this.window;
        win.loadURL(EDITOR_WINDOW_WEBPACK_ENTRY);
        win.setMenu(menu);
        if (!this._open) {
            this._open = true;
            win.show();
        }
        win.on('blur', () => {
            win.focus();
        });
    }
};