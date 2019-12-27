/**
 * Import
 */
const [
    {
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
    ConfigGlobal,
    APPNAME,
    TITLE,
    SLOGAN,
    VERSION,
    FRAMETIME,
    FRAMETIMETYPE
] = [
        null,
        null,
        null,
        null,
        null,
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
    if (!path.localPathExists(path.localPath('data/configs/global.json'))) path.localPathCreate(path.localPath('data/configs/global.json'));
    if (fs.existsSync(path.localPath('data/configs/global.json'))) {
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('data/configs/global.json'), 'utf8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "TITLE": "GRUPO MAVE 2019",
            "SLOGAN": "Você e seu Patrimônio em boas mãos!",
            "VERSION": "v3.0.0-rebuild",
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2
        }
        fs.writeFileSync(path.localPath('data/configs/global.json'), JSON.stringify(ConfigGlobal, null, 2), 'utf8');
    }
};

function titlechange() {
    let file = path.localPath('data/configs/global.json');
    if (!path.localPathExists(file)) path.localPathCreate(file);
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

function sloganchange() {
    let file = path.localPath('data/configs/global.json');
    if (!path.localPathExists(file)) path.localPathCreate(file);
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
    let file = path.localPath('data/configs/global.json');
    if (!path.localPathExists(file)) path.localPathCreate(file);
    fs.writeFileSync(file, JSON.stringify({
        "APPNAME": APPNAME,
        "TITLE": TITLE,
        "SLOGAN": SLOGAN,
        "VERSION": VERSION,
        "FRAMETIME": FRAMETIME,
        "FRAMETIMETYPE": FRAMETIMETYPE
    }, null, 2), 'utf8');
    inputDemoFrametimeInnerText();
    remote.getCurrentWindow().webContents.send('frame_time_refresh');
};

/**
 * Process
 */
$('#layerConfigs').hide();

$(document).ready(function () {
    $('#form-title').val(TITLE);
    $('#form-slogan').val(SLOGAN);

    $('#form-title')
        .keypress(titlechange)
        .keydown(titlechange)
        .keyup(titlechange);

    $('#form-slogan')
        .keypress(sloganchange)
        .keydown(sloganchange)
        .keyup(sloganchange);

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

    document.getElementById("radio_horas").onclick = function () {
        let file = path.localPath('data/configs/global.json');
        if (!path.localPathExists(file)) path.localPathCreate(file);
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
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    document.getElementById("radio_minutos").onclick = function () {
        let file = path.localPath('data/configs/global.json');
        if (!path.localPathExists(file)) path.localPathCreate(file);
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
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    document.getElementById("radio_segundos").onclick = function () {
        let file = path.localPath('data/configs/global.json');
        if (!path.localPathExists(file)) path.localPathCreate(file);
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
        $('#layerConfigs').show("fast");
    });