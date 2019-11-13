/**
 * Bootstrap
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap';
import './index.css';

/**
 * Render
 */
import * as Electron from 'electron';
import * as ConfigEditor from '../config/editor';
import DataGlobal from '../config/data/global.json';
import $ from 'jquery/dist/jquery';

let APPNAME = DataGlobal.APPNAME,
    VERSION = DataGlobal.VERSION,
    TITLE = DataGlobal.TITLE,
    SLOGAN = DataGlobal.SLOGAN,
    FRAMETIMETYPE = DataGlobal.FRAMETIMETYPE,
    FRAMETIME = DataGlobal.FRAMETIME;

document.title = ConfigEditor.TITLE;

$('#form-title').val(TITLE);
$('#form-slogan').val(SLOGAN);

/**
 * TITULO DO CABEÇALHO DA PAGINA INICIAL
 */
$('#form-title')
    .keypress(titlechange)
    .keydown(titlechange)
    .keyup(titlechange);

function titlechange() {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": $('#form-title').val(),
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8');
        TITLE = $('#form-title').val();
    }
};

/**
 * SLOGAN DO CABEÇALHO DA PAGINA INICIAL
 */
$('#form-slogan')
    .keypress(sloganchange)
    .keydown(sloganchange)
    .keyup(sloganchange);

function sloganchange() {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": $('#form-slogan').val(),
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8');
        SLOGAN = $('#form-slogan').val();
    }
};

/**
 * TEMPO DE TRANSIÇÃO DA PAGINA
 */
$(function () {
    document.getElementById('input-demo-frametime').innerText = (() => {
        switch (FRAMETIMETYPE) {
            case 1:
                return $('#input-frametime').val(FRAMETIME / 100000);
            case 2:
                return $('#input-frametime').val(FRAMETIME / 10000);
            case 3:
                return $('#input-frametime').val(FRAMETIME / 1000);
        };
    })();
    switch (FRAMETIMETYPE) {
        case 1:
            $('#radio_horas').attr('checked', '');
            $('#label_radio_horas').addClass('active');
            break;
        case 2:
            $('#radio_minutos').attr('checked', '');
            $('#label_radio_minutos').addClass('active');
            break;
        case 3:
            $('#radio_segundos').attr('checked', '');
            $('#label_radio_segundos').addClass('active');
            break;
    };
});

document.getElementById("radio_horas").onclick = function () {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": $('#input-frametime').val() * 100000,
            "FRAMETIMETYPE": 1
        }, null, 2), 'utf8');
        FRAMETIME = $('#input-frametime').val() * 100000;
        FRAMETIMETYPE = 1;
        inputDemoFrametimeInnerText();
    }
};

document.getElementById("radio_minutos").onclick = function () {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": $('#input-frametime').val() * 10000,
            "FRAMETIMETYPE": 2
        }, null, 2), 'utf8');
        FRAMETIME = $('#input-frametime').val() * 10000;
        FRAMETIMETYPE = 2;
        inputDemoFrametimeInnerText();
    }
};

document.getElementById("radio_segundos").onclick = function () {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": $('#input-frametime').val() * 1000,
            "FRAMETIMETYPE": 3
        }, null, 2), 'utf8');
        FRAMETIME = $('#input-frametime').val() * 1000;
        FRAMETIMETYPE = 3;
        inputDemoFrametimeInnerText();
    }
};

$('#input-frametime')
    .mousemove(inputDemoFrametimeInnerText)
    .hover(inputDemoFrametimeInnerText)
    .change(inputFrametimeChange);

function inputDemoFrametimeInnerText() {
    console.log($('#input-frametime').val());
    document.getElementById('input-demo-frametime').innerText = `Tempo Atual: ${(() => {
        switch (FRAMETIMETYPE) {
            case 1:
                return `${$('#input-frametime').val()} Hora(s)`;
            case 2:
                return `${$('#input-frametime').val()} Minuto(s)`;
            case 3:
                return `${$('#input-frametime').val()} Segundo(s)`;
        };
    })()}`;
};

function inputFrametimeChange() {
    if (FRAMETIMETYPE === 1) {
        FRAMETIME = $('#input-frametime').val() * 100000;
    } else if (FRAMETIMETYPE === 2) {
        FRAMETIME = $('#input-frametime').val() * 10000;
    } else if (FRAMETIMETYPE === 3) {
        FRAMETIME = $('#input-frametime').val() * 1000;
    }
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8');
        inputDemoFrametimeInnerText();
    }
};

/**
 * MENU WINDOW
 */
Electron.ipcRenderer.on('save_changes', () => {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8');
    }
});

console.log('👋 This message is being logged by "index.js", included via webpack');