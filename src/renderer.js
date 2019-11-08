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
import $ from 'jquery/dist/jquery';
import './modules/loadurls';

var logoImg = document.getElementById('logo');
logoImg.src = logoIcon;

document.title = ConfigGlobal.APPNAME;

document.getElementById('title').innerText = ConfigGlobal.TITLE;
document.getElementById('slogan').innerText = ConfigGlobal.SLOGAN;
document.getElementById('version').innerText = ConfigGlobal.VERSION;

// $('#layerContent').delay(5000).fadeOut('slow');

console.log('👋 This message is being logged by "renderer.js", included via webpack');