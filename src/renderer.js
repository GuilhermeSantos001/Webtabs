/**
 * Bootstrap
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap';

/**
 * Render
 */
import logoIcon from './img/logo.png';
import * as ConfigGlobal from './config/global';
import './modules/loadurls';


var logoImg = document.getElementById('logo');
logoImg.src = logoIcon;

document.title = ConfigGlobal.TITLE;

document.getElementById('title').innerText = ConfigGlobal.TITLE;
document.getElementById('version').innerText = ConfigGlobal.VERSION;

console.log('👋 This message is being logged by "renderer.js", included via webpack');