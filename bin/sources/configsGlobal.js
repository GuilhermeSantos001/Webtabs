/**
 * Import
 */
const [{
    remote,
    ipcRenderer
},
    path,
    fs
] = [
        require('electron'),
        require('../import/localPath'),
        require('fs'),
    ];

/**
 * Variables
 */
let [
    ConfigGlobal
] = [
        null
    ]

/**
 * SCI ▲
 * 
 * Self Callers Initialize
 */
createConfigGlobal();

/**
 *  Functions
 */
function createConfigGlobal() {
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    if (fs.existsSync(path.localPath('configs/global.json'))) {
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "TITLE": "GRUPO MAVE 2019",
            "SLOGAN": "Você e seu Patrimônio em boas mãos!",
            "VERSION": "v5.17.30-build",
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2,
            "LOGO": "assets/img/logo.png"
        }
        fs.writeFileSync(path.localPath('configs/global.json'), JSON.stringify(ConfigGlobal, null, 2), 'utf8');
    }
};

function titlechange() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "TITLE": $('#form-title').val(),
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE
    }, null, 2), 'utf8');
    ConfigGlobal.TITLE = $('#form-title').val();
};

function sloganchange() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": $('#form-slogan').val(),
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE
    }, null, 2), 'utf8');
    ConfigGlobal.SLOGAN = $('#form-slogan').val();
};

function inputDemoFrametimeInnerText() {
    document.getElementById('input-demo-frametime').innerText = `Tempo Atual: ${(() => {
        switch (ConfigGlobal.FRAMETIMETYPE) {
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
    ConfigGlobal.FRAMETIME = Number($('#input-frametime').val());
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE
    }, null, 2), 'utf8');
    inputDemoFrametimeInnerText();
    remote.getCurrentWindow().webContents.send('frame_time_refresh');
};

/**
 * Process
 */
$('#layerConfigs').hide();

$('#layerListConfigs').append(fs.readFileSync(path.localPath('bin\\menus\\html\\mainconfigs.html', true), 'utf8'));

$(document).ready(function () {
    $('#logo').attr('src', ConfigGlobal.LOGO);
    $('#form-title').val(ConfigGlobal.TITLE);
    $('#form-slogan').val(ConfigGlobal.SLOGAN);

    $('#form-title')
        .keypress(titlechange)
        .keydown(titlechange)
        .keyup(titlechange);

    $('#form-slogan')
        .keypress(sloganchange)
        .keydown(sloganchange)
        .keyup(sloganchange);

    $("#input-frametime").attr({
        "value": `${ConfigGlobal.FRAMETIME}`
    });

    switch (ConfigGlobal.FRAMETIMETYPE) {
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
        $('#layerConfigs').animate({
            "height": "0vh",
            "opacity": 0
        }, "fast").hide("fast");
    };

    document.getElementById("radio_horas").onclick = function () {
        let file = path.localPath('configs/global.json');
        if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 1
        }, null, 2), 'utf8');
        ConfigGlobal.FRAMETIME = Number($('#input-frametime').val());
        ConfigGlobal.FRAMETIMETYPE = 1;
        inputDemoFrametimeInnerText();
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    document.getElementById("radio_minutos").onclick = function () {
        let file = path.localPath('configs/global.json');
        if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 2
        }, null, 2), 'utf8');
        ConfigGlobal.FRAMETIME = Number($('#input-frametime').val());
        ConfigGlobal.FRAMETIMETYPE = 2;
        inputDemoFrametimeInnerText();
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    document.getElementById("radio_segundos").onclick = function () {
        let file = path.localPath('configs/global.json');
        if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 3
        }, null, 2), 'utf8');
        ConfigGlobal.FRAMETIME = Number($('#input-frametime').val());
        ConfigGlobal.FRAMETIMETYPE = 3;
        inputDemoFrametimeInnerText();
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    $('#input-frametime')
        .mousemove(inputDemoFrametimeInnerText)
        .hover(inputDemoFrametimeInnerText)
        .change(inputFrametimeChange);
});

/**
 * Events
 */
ipcRenderer
    .on('window_configs_global', () => {
        $('#layerConfigs').show("fast").animate({
            "height": "100vh",
            "opacity": 100
        }, "fast");
    })
    .on('set_logo_config_main', (event, value) => {
        let file = path.localPath('configs/global.json');
        if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
        fs.writeFileSync(file, JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": ConfigGlobal.FRAMETIME,
            "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
            "LOGO": String(value)
        }, null, 2), 'utf8');
    });