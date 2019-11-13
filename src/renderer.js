/**
 * Bootstrap
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap';
import './renderer.css'

/**
 * Render
 */
import * as Electron from 'electron';
import * as ConfigGlobal from './config/global';
import $ from 'jquery/dist/jquery';
import file_logo from './img/logo.png';
import WindowEditor from './modules/editorConfigs';
import './modules/loadurls';
import './modules/configsMain';

let window_editor;

Electron.ipcRenderer.on('open_editor', () => {
    if (!window_editor) window_editor = new WindowEditor();
    if (!window_editor.isOpen()) window_editor.open();
});

let logo = document.getElementById('logo');
logo.src = `${Electron.remote.process.mainModule.path.replace('main', 'renderer')}\\${file_logo}`;

document.title = ConfigGlobal.APPNAME;

document.getElementById('title').innerText = ConfigGlobal.TITLE;
document.getElementById('slogan').innerText = ConfigGlobal.SLOGAN;
document.getElementById('version').innerText = ConfigGlobal.VERSION;

$('#layerContent').delay(5000).fadeOut('slow');

console.log('👋 This message is being logged by "renderer.js", included via webpack');