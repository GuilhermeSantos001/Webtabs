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
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf-8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "CONNECTIONTYPE": "http",
            "SERVERIP": "localhost",
            "SERVERPORT": "3000",
            "APISYSTEMCODE": "113195464d008eaf8e6b648574bd5306",
            "SERVERLOGINUSER": "admin",
            "SERVERLOGINPASS": "123",
            "TITLE": "WEBTABS",
            "SLOGAN": "Visualizar suas páginas favoritas como slides, nunca foi tão fácil.",
            "VERSION": controller.versionSystem,
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2,
            "LOGO": "assets/img/logo.png"
        }
        fs.writeFileSync(path.localPath('configs/global.json'), Buffer.from(JSON.stringify(ConfigGlobal), 'utf-8'), {
            flag: 'w+'
        });
    }
};

function refreshstringconnection() {
    const server = {
        connectionType: $('#form-server-connection-type').val(),
        ip: $('#form-server-ip').val(),
        port: $('#form-server-port').val()
    }

    $('#server_string_connection').text(`Resultado da string de conexão: ${server.connectionType}://${server.ip}:${server.port}`);
};

function serverconnectiontype() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": $('#form-server-connection-type').val(),
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.CONNECTIONTYPE = $('#form-server-connection-type').val();
};

function serverip() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": $('#form-server-ip').val(),
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.SERVERIP = $('#form-server-ip').val();
};

function serverport() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": $('#form-server-port').val(),
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.SERVERPORT = $('#form-server-port').val();
};

function apisystemcode() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": $('#form-api-system-code').val(),
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.APISYSTEMCODE = $('#form-api-system-code').val();
};

function serverloginuser() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": $('#form-server-login-user').val(),
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.SERVERLOGINUSER = $('#form-server-login-user').val();
};

function serverloginpass() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": $('#form-server-login-pass').val(),
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.SERVERLOGINPASS = $('#form-server-login-pass').val();
};

function titlechange() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": $('#form-title').val(),
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
    ConfigGlobal.TITLE = $('#form-title').val();
};

function sloganchange() {
    let file = path.localPath('configs/global.json');
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": $('#form-slogan').val(),
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
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
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "APPNAME": ConfigGlobal.APPNAME,
        "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
        "SERVERIP": ConfigGlobal.SERVERIP,
        "SERVERPORT": ConfigGlobal.SERVERPORT,
        "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
        "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
        "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,
        "TITLE": ConfigGlobal.TITLE,
        "SLOGAN": ConfigGlobal.SLOGAN,
        "VERSION": ConfigGlobal.VERSION,
        "FRAMETIME": ConfigGlobal.FRAMETIME,
        "FRAMETIMETYPE": ConfigGlobal.FRAMETIMETYPE,
        "LOGO": ConfigGlobal.LOGO
    }), 'utf-8'), {
        flag: 'w+'
    });
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
        <label for="form-server-connection-type">
            Método de conexão com o servidor
            <p class="mb-0">
                Escolha entre a conexão comum HTTP ou com a camada de segurança HTTPS.
            </p>
        </label>
        <select class="custom-select" id="form-server-connection-type">
            <option value="http" selected>HTTP</option>
            <option value="https">HTTPS</option>
        </select>
        <label for="form-server-ip">
            IP do servidor
            <p class="mb-0">
                Esse é o endereço da API que irá se comunicar com o webtabs.
            </p>
        </label>
        <input type="text" class="form-control border border-light bg-dark text-white" id="form-server-ip"
            placeholder="Insira o endereço de ip..." value="localhost">
        <label for="form-server-port">
            Porta do servidor
            <p class="mb-0">
                Essa é a porta que o servidor está escutando.
            </p>
        </label>
        <input type="number" class="form-control border border-light bg-dark text-white" id="form-server-port"
            placeholder="Insira a porta..." value="3000">
        <label for="form-api-system-code">
            API system code
            <p class="mb-0">
                Usado para autenticar com segurança a API.
            </p>
        </label>
        <input type="password" class="form-control border border-light bg-dark text-white" id="form-api-system-code"
            placeholder="Insira o código secreto da API..." value="113195464d008eaf8e6b648574bd5306">
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="form_api_system_code_show_or_hide">
            <label class="custom-control-label" for="form_api_system_code_show_or_hide">Exibir API system code.</label>
        </div>
        <label for="form-server-login-user">
            Nome de usuário
            <p class="mb-0">
                Usado para autenticar com segurança a API.
            </p>
        </label>
        <input type="text" class="form-control border border-light bg-dark text-white" id="form-server-login-user"
            placeholder="Insira o nome de usuário..." value="admin">
        <label for="form-server-login-pass">
            Senha de usuário
            <p class="mb-0">
                Usado para autenticar com segurança a API.
            </p>
        </label>
        <input type="password" class="form-control border border-light bg-dark text-white" id="form-server-login-pass"
            placeholder="Insira a senha de usuário..." value="123">
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="form_server_login_password_show_or_hide">
            <label class="custom-control-label" for="form_server_login_password_show_or_hide">Exibir a senha de usuário.</label>
        </div>
    </div>
    <p id="server_string_connection">Resultado da string de conexão: http://localhost:3000</p>
</li>
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
            id="button_reset_logo_main">Restaurar</button>
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
                Defina o tempo que o site deve ficar visível até que outro seja exibido.
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
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf-8')) || [];
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

    document.getElementById('form_api_system_code_show_or_hide').onclick = function () {
        if ($('#form_api_system_code_show_or_hide').is(":checked")) {
            $('#form-api-system-code').attr('type', 'text');
        } else {
            $('#form-api-system-code').attr('type', 'password');
        }
    };

    document.getElementById('form_server_login_password_show_or_hide').onclick = function () {
        if ($('#form_server_login_password_show_or_hide').is(":checked")) {
            $('#form-server-login-pass').attr('type', 'text');
        } else {
            $('#form-server-login-pass').attr('type', 'password');
        }
    };    
</script>
`);

$(document).ready(function () {
    $('#logo').attr('src', ConfigGlobal.LOGO);
    $('#form-server-connection-type').val(ConfigGlobal.CONNECTIONTYPE);
    $('#form-server-ip').val(ConfigGlobal.SERVERIP);
    $('#form-server-port').val(ConfigGlobal.SERVERPORT);
    $('#form-api-system-code').val(ConfigGlobal.APISYSTEMCODE);
    $('#form-server-login-user').val(ConfigGlobal.SERVERLOGINUSER);
    $('#form-server-login-pass').val(ConfigGlobal.SERVERLOGINPASS);
    $('#form-title').val(ConfigGlobal.TITLE);
    $('#form-slogan').val(ConfigGlobal.SLOGAN);

    $('#form-server-connection-type').change(function () {
        serverconnectiontype();
        refreshstringconnection();
    });

    $('#form-server-ip').on('keydown, keyup', function () {
        serverip();
        refreshstringconnection();
    });

    $('#form-server-port').on('keydown, keyup', function () {
        serverport();
        refreshstringconnection();
    });

    $('#form-api-system-code').on('keydown, keyup', apisystemcode);

    $('#form-server-login-user').on('keydown, keyup', serverloginuser);

    $('#form-server-login-pass').on('keydown, keyup', serverloginpass);

    $('#form-title').on('keydown, keyup', titlechange)

    $('#form-slogan').on('keydown, keyup', sloganchange)

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
        fs.writeFileSync(file, Buffer.from(JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
            "SERVERIP": ConfigGlobal.SERVERIP,
            "SERVERPORT": ConfigGlobal.SERVERPORT,
            "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
            "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
            "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,            
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 1,
            "LOGO": ConfigGlobal.LOGO
        }), 'utf-8'), {
            flag: 'w+'
        });
        ConfigGlobal.FRAMETIME = Number($('#input-frametime').val());
        ConfigGlobal.FRAMETIMETYPE = 1;
        inputDemoFrametimeInnerText();
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    document.getElementById("radio_minutos").onclick = function () {
        let file = path.localPath('configs/global.json');
        if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
        fs.writeFileSync(file, Buffer.from(JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
            "SERVERIP": ConfigGlobal.SERVERIP,
            "SERVERPORT": ConfigGlobal.SERVERPORT,
            "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
            "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
            "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,            
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 2,
            "LOGO": ConfigGlobal.LOGO
        }), 'utf-8'), {
            flag: 'w+'
        });
        ConfigGlobal.FRAMETIME = Number($('#input-frametime').val());
        ConfigGlobal.FRAMETIMETYPE = 2;
        inputDemoFrametimeInnerText();
        remote.getCurrentWindow().webContents.send('frame_time_refresh');
    };

    document.getElementById("radio_segundos").onclick = function () {
        let file = path.localPath('configs/global.json');
        if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
        fs.writeFileSync(file, Buffer.from(JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
            "SERVERIP": ConfigGlobal.SERVERIP,
            "SERVERPORT": ConfigGlobal.SERVERPORT,
            "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
            "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
            "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,            
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 3,
            "LOGO": ConfigGlobal.LOGO
        }), 'utf-8'), {
            flag: 'w+'
        });
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
        fs.writeFileSync(file, Buffer.from(JSON.stringify({
            "APPNAME": ConfigGlobal.APPNAME,
            "CONNECTIONTYPE": ConfigGlobal.CONNECTIONTYPE,
            "SERVERIP": ConfigGlobal.SERVERIP,
            "SERVERPORT": ConfigGlobal.SERVERPORT,
            "APISYSTEMCODE": ConfigGlobal.APISYSTEMCODE,
            "SERVERLOGINUSER": ConfigGlobal.SERVERLOGINUSER,
            "SERVERLOGINPASS": ConfigGlobal.SERVERLOGINPASS,            
            "TITLE": ConfigGlobal.TITLE,
            "SLOGAN": ConfigGlobal.SLOGAN,
            "VERSION": ConfigGlobal.VERSION,
            "FRAMETIME": Number($('#input-frametime').val()),
            "FRAMETIMETYPE": 3,
            "LOGO": ConfigGlobal.LOGO
        }), 'utf-8'), {
            flag: 'w+'
        });
    });