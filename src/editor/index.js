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
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": $('#form-title').val(),
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8', () => {
            TITLE = $('#form-title').val();
        })
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
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": $('#form-slogan').val(),
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8', () => {
            SLOGAN = $('#form-slogan').val();
        })
    }
};

/**
 * TEMPO DE TRANSIÇÃO DA PAGINA
 */

document.getElementById('input-demo-frametime').innerText = (() => {
    switch (FRAMETIMETYPE) {
        case 1:
            $('#input-frametime').val(FRAMETIME / 1000000);
            return `Tempo Atual: ${FRAMETIME / 1000000} Hora(s)`;
        case 2:
            $('#input-frametime').val(FRAMETIME / 10000);
            return `Tempo Atual: ${FRAMETIME / 10000} Minuto(s)`;
        case 3:
            $('#input-frametime').val(FRAMETIME / 1000);
            return `Tempo Atual: ${FRAMETIME / 1000} Segundo(s)`;
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

$("#radio_horas").click(function () {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": $('#input-frametime').val() * 1000000,
            "FRAMETIMETYPE": 1
        }, null, 2), 'utf8', () => {
            FRAMETIMETYPE = 1;
            inputDemoFrametimeInnerText();
        })
    }
});

$("#radio_minutos").click(function () {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": $('#input-frametime').val() * 10000,
            "FRAMETIMETYPE": 2
        }, null, 2), 'utf8', () => {
            FRAMETIMETYPE = 2;
            inputDemoFrametimeInnerText();
        })
    }
});

$("#radio_segundos").click(function () {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": $('#input-frametime').val() * 1000,
            "FRAMETIMETYPE": 3
        }, null, 2), 'utf8', () => {
            FRAMETIMETYPE = 3;
            inputDemoFrametimeInnerText();
        })
    }
});

$('#input-frametime')
    .mousemove(inputDemoFrametimeInnerText)
    .hover(inputDemoFrametimeInnerText)
    .change(inputFrametimeChange);

function inputDemoFrametimeInnerText() {
    document.getElementById('input-demo-frametime').innerText = `Tempo Atual: ${$('#input-frametime').val()} ${(() => {
        switch (FRAMETIMETYPE) {
            case 1:
                return 'Hora(s)';
            case 2:
                return 'Minuto(s)';
            case 3:
                return 'Segundo(s)';
        };
    })()}`;
}

function inputFrametimeChange() {
    let frametime;
    if (FRAMETIMETYPE === 1) {
        frametime = $('#input-frametime').val() * 1000000;
    } else if (FRAMETIMETYPE === 2) {
        frametime = $('#input-frametime').val() * 10000;
    } else if (FRAMETIMETYPE === 3) {
        frametime = $('#input-frametime').val() * 1000;
    }
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": frametime,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8', () => {
            inputDemoFrametimeInnerText();
        })
    }
}

/**
 * MENU WINDOW
 */
Electron.ipcRenderer.on('save_changes', () => {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/global.json');
    if (fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify({
            "APPNAME": APPNAME,
            "TITLE": TITLE,
            "SLOGAN": SLOGAN,
            "VERSION": VERSION,
            "FRAMETIME": FRAMETIME,
            "FRAMETIMETYPE": FRAMETIMETYPE
        }, null, 2), 'utf8', () => {

        });
    }
});

console.log('👋 This message is being logged by "index.js", included via webpack');