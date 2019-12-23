/**
 * Render
 */
import * as Electron from 'electron';
import $ from 'jquery/dist/jquery';
import { localPath, localPathExists, localPathCreate } from './localPath';

let data;
if (!localPathExists(localPath('src/config/data/global.json'))) localPathCreate(localPath('src/config/data/global.json'));
if (Electron.remote.require('fs').existsSync(localPath('src/config/data/global.json'))) {
    data = JSON.parse(Electron.remote.require('fs').readFileSync(localPath('src/config/data/global.json'), 'utf8')) || {
        "APPNAME": "WEBTABS",
        "TITLE": "GRUPO MAVE 2019",
        "SLOGAN": "Você e seu Patrimônio em boas mãos!",
        "VERSION": "v3.0.0-rebuild",
        "FRAMETIME": 2,
        "FRAMETIMETYPE": 2
    };
} else {
    data = {
        "APPNAME": "WEBTABS",
        "TITLE": "GRUPO MAVE 2019",
        "SLOGAN": "Você e seu Patrimônio em boas mãos!",
        "VERSION": "v3.0.0-rebuild",
        "FRAMETIME": 2,
        "FRAMETIMETYPE": 2
    }
    Electron.remote.require('fs').writeFileSync(localPath('src/config/data/global.json'), JSON.stringify(data, null, 2), 'utf8');
}

let APPNAME = data.APPNAME,
    TITLE = data.TITLE,
    SLOGAN = data.SLOGAN,
    VERSION = data.VERSION,
    FRAMETIME = data.FRAMETIME,
    FRAMETIMETYPE = data.FRAMETIMETYPE;

$('#form-title').val(TITLE);
$('#form-slogan').val(SLOGAN);
$('#layerConfigs').hide();

/**
 * TITULO DO CABEÇALHO DA PAGINA INICIAL
 */
$('#form-title')
    .keypress(titlechange)
    .keydown(titlechange)
    .keyup(titlechange);

function titlechange() {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/global.json');
    if (!localPathExists(file)) localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": $('#form-title').val(),
        "SLOGAN": SLOGAN,
        "VERSION": VERSION,
        "FRAMETIME": FRAMETIME,
        "FRAMETIMETYPE": FRAMETIMETYPE
    }, null, 2), 'utf8');
    TITLE = $('#form-title').val();
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
        file = localPath('src/config/data/global.json');
    if (!localPathExists(file)) localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": TITLE,
        "SLOGAN": $('#form-slogan').val(),
        "VERSION": VERSION,
        "FRAMETIME": FRAMETIME,
        "FRAMETIMETYPE": FRAMETIMETYPE
    }, null, 2), 'utf8');
    SLOGAN = $('#form-slogan').val();
};

/**
 * TEMPO DE TRANSIÇÃO DA PAGINA
 */
$(document).ready(function () {
    $("#input-frametime").attr({
        "value": `${FRAMETIME}`
    });
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
    inputDemoFrametimeInnerText();
    document.getElementById("button_exit_global").onclick = function () {
        $('#layerConfigs').hide("fast");
    };
});

document.getElementById("radio_horas").onclick = function () {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/global.json');
    if (!localPathExists(file)) localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": TITLE,
        "SLOGAN": SLOGAN,
        "VERSION": VERSION,
        "FRAMETIME": Number($('#input-frametime').val()),
        "FRAMETIMETYPE": 1
    }, null, 2), 'utf8');
    FRAMETIME = Number($('#input-frametime').val());
    FRAMETIMETYPE = 1;
    inputDemoFrametimeInnerText();
    Electron.remote.getCurrentWindow().webContents.send('frame_time_refresh');
};

document.getElementById("radio_minutos").onclick = function () {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/global.json');
    if (!localPathExists(file)) localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": TITLE,
        "SLOGAN": SLOGAN,
        "VERSION": VERSION,
        "FRAMETIME": Number($('#input-frametime').val()),
        "FRAMETIMETYPE": 2
    }, null, 2), 'utf8');
    FRAMETIME = Number($('#input-frametime').val());
    FRAMETIMETYPE = 2;
    inputDemoFrametimeInnerText();
    Electron.remote.getCurrentWindow().webContents.send('frame_time_refresh');
};

document.getElementById("radio_segundos").onclick = function () {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/global.json');
    if (!localPathExists(file)) localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": TITLE,
        "SLOGAN": SLOGAN,
        "VERSION": VERSION,
        "FRAMETIME": Number($('#input-frametime').val()),
        "FRAMETIMETYPE": 3
    }, null, 2), 'utf8');
    FRAMETIME = Number($('#input-frametime').val());
    FRAMETIMETYPE = 3;
    inputDemoFrametimeInnerText();
    Electron.remote.getCurrentWindow().webContents.send('frame_time_refresh');
};

$('#input-frametime')
    .mousemove(inputDemoFrametimeInnerText)
    .hover(inputDemoFrametimeInnerText)
    .change(inputFrametimeChange);

function inputDemoFrametimeInnerText() {
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
    FRAMETIME = Number($('#input-frametime').val());
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/global.json');
    if (!localPathExists(file)) localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": TITLE,
        "SLOGAN": SLOGAN,
        "VERSION": VERSION,
        "FRAMETIME": FRAMETIME,
        "FRAMETIMETYPE": FRAMETIMETYPE
    }, null, 2), 'utf8');
    inputDemoFrametimeInnerText();
    Electron.remote.getCurrentWindow().webContents.send('frame_time_refresh');
};

Electron.ipcRenderer.on('window_configs_global', () => {
    $('#layerConfigs').show("fast");
});