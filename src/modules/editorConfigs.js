import * as ConfigEditor from '../config/editor';
import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';

const { BrowserWindow } = Electron.remote.require('electron');

let win = new BrowserWindow({ width: 800, height: 600, frame: false });
win.loadURL(EDITOR_WINDOW_WEBPACK_ENTRY);
win.show();
win.webContents.openDevTools();

Electron.remote.getCurrentWindow().on('close', () => { win.close(); win = null; });