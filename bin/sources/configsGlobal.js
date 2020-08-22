/**
 * Import
 */
const [{
        remote,
        ipcRenderer
    },
    path,
    fs,
    menuManager,
    controller
] = [
    require('electron'),
    require('../import/localPath'),
    require('fs'),
    require('../import/MenuManager'),
    require('../import/controller')
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
            "TITLE": "WEBTABS",
            "SLOGAN": "Visualizar suas páginas favoritas como slides, nunca foi tão fácil.",
            "VERSION": controller.versionSystem,
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

$('#layerListConfigs').append(`
    <li class="list-group-item border border-light bg-dark text-white mb-2">
        <div class="form-group">
            <label for="form-title">
                Logo
                <p class="mb-0">
                    Defina uma foto para ser exibida na janela inicial do programa.<br />
                    Tamanho da moldura - Largura: 545px x Altura: 155px<br />
                </p>
                <img id="image_logo_main" class="float-lef shadow border" style="width: 545px; height: 155px;">
            </label>
            <div class="custom-file">
                <input type="file" accept="image/*" class="custom-file-input" id="input_logo_main">
                <label id="show_filePath_logo" class="custom-file-label" for="input_logo_main">Procurar Imagem...</label>
            </div>
            <button type="button" class="btn btn-lg btn-block btn-outline-light mt-2 mb-2"
                id="button_reset_logo_main">Resetar</button>
        </div>
    </li>
    <li class="list-group-item border border-light bg-dark text-white mb-2">
        <div class="form-group">
            <label for="form-title">
                Titulo
                <p class="mb-0">
                    Esse titulo é usado no cabeçalho da janela inicial do programa.
                </p>
            </label>
            <input type="text" class="form-control border border-light bg-dark text-white" id="form-title"
                placeholder="Insira um titulo...">
        </div>
    </li>
    <li class="list-group-item border border-light bg-dark text-white mb-2">
        <div class="form-group">
            <label for="form-slogan">
                Slogan
                <p class="mb-0">
                    Esse slogan é usado a baixo do titulo no cabeçalho da janela inicial do programa.
                </p>
            </label>
            <input type="text" class="form-control border border-light bg-dark text-white" id="form-slogan"
                placeholder="Insira um slogan...">
        </div>
    </li>
    <li class="list-group-item border border-light bg-dark text-white mb-2">
        <div class="form-group">
            <label for="form-frametime">
                Tempo de transição
                <p class="mb-0">
                    Defina o tempo que o site deve ficar visivel até que outro seja exibido.
                </p>
            </label>
            <div class="custom-control custom-radio">
                <input type="radio" id="radio_horas" name="customRadio" class="custom-control-input">
                <label id="label_radio_horas" class="custom-control-label" for="radio_horas">Horas</label>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" id="radio_minutos" name="customRadio" class="custom-control-input">
                <label id="label_radio_minutos" class="custom-control-label" for="radio_minutos">Minutos</label>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" id="radio_segundos" name="customRadio" class="custom-control-input">
                <label id="label_radio_segundos" class="custom-control-label" for="radio_segundos">Segundos</label>
            </div>
            <input id="input-frametime" type="range" min="1" max="60" value="1" class="custom-range">
            <p id="input-demo-frametime" class="mb-0"></p>
        </div>
    </li>
    <script>
        let ConfigGlobal = {};

        if (fs.existsSync(path.localPath('configs/global.json'))) {
            ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf8')) || [];
        }

        if (!ConfigGlobal.LOGO) {
            ConfigGlobal.LOGO = "assets/img/logo.png";
        }

        $('#image_logo_main').attr('src', ConfigGlobal.LOGO);

        $('#input_logo_main').on('change', function () {
            ConfigGlobal.LOGO = document.getElementById('input_logo_main').files[0].path;
            $('#show_filePath_logo').text(ConfigGlobal.LOGO);
            $('#image_logo_main').attr('src', ConfigGlobal.LOGO);
            remote.getCurrentWindow().webContents.send('set_logo_config_main', ConfigGlobal.LOGO);
        });

        document.getElementById('button_reset_logo_main').onclick = function () {
            $('#show_filePath_logo').text('Procurar Imagem...');
            $('#image_logo_main').attr('src', "assets/img/logo.png");
            ConfigGlobal.LOGO = "assets/img/logo.png";
            remote.getCurrentWindow().webContents.send('set_logo_config_main', ConfigGlobal.LOGO);
        };
    </script>
`);

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
        menuManager.clear();
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
        if (menuManager.isClear()) {
            $('#layerConfigs').show("fast").animate({
                "height": "100vh",
                "opacity": 100
            }, "fast");
            menuManager.setMenu('configsGlobal');
        } else {
            if (menuManager.isMenu('configsGlobal')) {
                $('#button_exit_global').click();
            }
        }
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