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
        "FRAMETIME": 20000,
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

$('#layerContent').delay(5000).fadeOut('slow');

console.log('👋 This message is being logged by "renderer.js", included via webpack');