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
import logoIcon from '../img/logo.png';
import * as ConfigEditor from '../config/editor';
import $ from 'jquery/dist/jquery';

var logoImg = document.getElementById('logo');
logoImg.src = logoIcon;

document.title = ConfigEditor.TITLE;

console.log('👋 This message is being logged by "index.js", included via webpack');