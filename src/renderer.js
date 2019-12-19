/**
 * Bootstrap
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap';
import 'material-design-icons/iconfont/material-icons.css';
import './renderer.css'

/**
 * Render
 */
import * as Electron from 'electron';
import $ from 'jquery/dist/jquery';
import file_logo from './img/logo.png';
import './modules/loadurls';
import './modules/configsMain';
import './modules/configsGlobal';
import { localPath, localPathExists, localPathCreate } from './modules/localPath';

let data;
if (!localPathExists(localPath('src/config/data/global.json'))) localPathCreate(localPath('src/config/data/global.json'));
if (Electron.remote.require('fs').existsSync(localPath('src/config/data/global.json'))) {
    data = JSON.parse(Electron.remote.require('fs').readFileSync(localPath('src/config/data/global.json'), 'utf8')) || [];
} else {
    data = {
        "APPNAME": "WEBTABS",
        "TITLE": "GRUPO MAVE 2019",
        "SLOGAN": "Você e seu Patrimônio em boas mãos!",
        "VERSION": "v3.0.0-rebuild",
        "FRAMEIDENTIFIER": 2,
        "FRAMETIME": 120000,
        "FRAMETIMETYPE": 2
    }
    Electron.remote.require('fs').writeFileSync(localPath('src/config/data/global.json'), JSON.stringify(data, null, 2), 'utf8');
}

let logo = document.getElementById('logo');
logo.src = `${Electron.remote.process.mainModule.path.replace('main', 'renderer')}\\${file_logo}`;

document.title = data.APPNAME;

document.getElementById('title').innerText = data.TITLE;
document.getElementById('slogan').innerText = data.SLOGAN;
document.getElementById('version').innerText = data.VERSION;

let height = $('#layerContent').height();
$('#layerContent').delay(3500).animate({ "margin-top": `-=${height}`, opacity: 0 }, 'slow', function () {
    $('#layerContent').hide();
});

$(document).ready(function () {
    $('#layerContainer').fadeOut(function () { $('#layerContainer').css('filter', 'opacity(100%)'); }).delay().fadeIn('slow');
});

console.log(
    '%c✩%c✩%c✩ %cWEBTABS %c✩%c✩%c✩',
    'font-size: 250%; color: #292929;',
    'font-size: 290%; color: #292929;',
    'font-size: 250%; color: #292929;',
    'color: #501cc9; font-size: 300%;',
    'font-size: 250%; color: #292929;',
    'font-size: 290%; color: #292929;',
    'font-size: 250%; color: #292929;',
);
console.log('%c🔬 AMBIENTE DE DESENVOLVIMENTO - 3.0.0-beta.4 📜', 'color: #f03c3c; padding: 8px; font-size: 200%;');

/**
 * Menu Events
 */
Electron.ipcRenderer.on('show_scroll_page', () => {
    $('html, body').css('overflowX', 'auto');
    $('html, body').css('overflowY', 'auto');
    try { $('.layerFrame').children()[0].insertCSS('body, html { overflow-y: auto; overflow-x: auto; }'); } catch (e) { };

});

Electron.ipcRenderer.on('hide_scroll_page', () => {
    $('html, body').css('overflowX', 'hidden');
    $('html, body').css('overflowY', 'hidden');
    try { $('.layerFrame').children()[0].insertCSS('body, html { overflow-y: hidden; overflow-x: hidden; }'); } catch (e) { };
});

Electron.ipcRenderer.on('window_show_cursor', () => {
    Electron.remote.getCurrentWindow().webContents.insertCSS('* { cursor: auto; pointer-events: auto; user-select: auto;}');
});

Electron.ipcRenderer.on('window_hide_cursor', () => {
    Electron.remote.getCurrentWindow().webContents.insertCSS('* { cursor: none; pointer-events: none; user-select: none;}');
});