import * as ConfigEditor from '../config/editor';
import * as Electron from 'electron';

const { BrowserWindow, Menu } = Electron.remote.require('electron');
let win;
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
        this.width = ConfigEditor.WIDTH;
        this.height = ConfigEditor.HEIGTH;
        this.minWidth = ConfigEditor.WIDTH / 2;
        this.minHeight = ConfigEditor.HEIGTH / 2;
        this._open = false;
    }
    isOpen() {
        return this._open;
    }
    open() {
        this._open = true;
        win = new BrowserWindow({
            width: this.width,
            height: this.height,
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true
            }
        });
        win.loadURL(EDITOR_WINDOW_WEBPACK_ENTRY);
        win.setMenu(menu);
        win.show();
        win.webContents.openDevTools();
        win.on('blur', this.blur.bind(this));
        win.on('close', this.close.bind(this));
    }
    blur() {
        win.focus();
    }
    close() {
        win = null;
        this._open = false;
    }
};