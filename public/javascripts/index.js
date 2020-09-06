$(document).ready(function () {
    $('input#input_text, textarea#textarea1').characterCounter();
    $('select').material_select();
    $('.collapsible').collapsible();
    $('.modal').modal();
    Materialize.updateTextFields();
    restoreUserData();
});

function restoreUserData() {
    let data = JSON.parse(localStorage.getItem('userdata'));

    if (data && data['user'] && data['pass']) {
        $('#application_username').val(data['user']);
        $('#application_password').val(data['pass']);
        $('#application_store_user_data').attr('checked', true);
    }
}

function saveUserData() {
    if ($('#application_store_user_data').is(":checked")) {
        let user = $('#application_username').val(),
            pass = $('#application_password').val();

        localStorage.setItem('userdata', JSON.stringify({
            user,
            pass
        }));
    }
}

document.getElementById('application_username').onkeyup = function () {
    saveUserData();
};

document.getElementById('application_password').onkeyup = function () {
    saveUserData();
};

document.getElementById('application_store_user_data').onclick = function () {
    if ($('#application_store_user_data').is(":checked")) {
        saveUserData();
    } else {
        localStorage.removeItem('userdata');
    }
};

function commandId() {
    let words = [
            'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l',
            'm', 'n', 'o', 'p', 'q', 'r',
            's', 't', 'u', 'v', 'w', 'x',
            'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9'
        ],
        i = 0,
        id = '';

    for (; i < 10; i++) {
        id += words[Math.floor(Math.random() * words.length)];
    }

    return id;
}

document.getElementById('application_password_show_or_hide').onclick = function () {
    if ($('#application_password_show_or_hide').is(":checked")) {
        $('#application_password').attr('type', 'text');
    } else {
        $('#application_password').attr('type', 'password');
    }
};

const base_url = `http://${$('#server_ip').val()}:${$('#server_port').val()}`;

[
    'render_reload',
    'render_next',
    'render_return',
    'render_fullscreen',
    'render_menubarshow',
    'render_menubarhide',
    'render_mouseshow',
    'render_mousehide',
    'render_running',
    'render_pause',
    'system_toogledevtools',
    'system_tooglereload'
].map(buttonName => {
    document.getElementById(buttonName).onclick = function () {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${base_url}/commands/register`,
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "system-code": "113195464d008eaf8e6b648574bd5306"
            },
            "processData": false,
            "data": JSON.stringify({
                user: $('#application_username').val(),
                pass: $('#application_password').val(),
                id: commandId(),
                value: buttonName
            })
        }

        $.ajax(settings).done(function (res) {
            console.log(res);
        });
    };
});

document.getElementById('sendServerCommands').onclick = function () {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `${base_url}/managerFrame/command/register`,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "system-code": "113195464d008eaf8e6b648574bd5306"
        },
        "processData": false,
        "data": JSON.stringify({
            user: $('#application_username').val(),
            pass: $('#application_password').val(),
            id: commandId(),
            type: "frame_add_url",
            value: {
                title: $('#application_url_title').val(),
                url: $('#application_url_value').val()
            }
        })
    }

    $.ajax(settings).done(function (response) {
        let message = response ? response.result : 'Erro Inesperado...';
        $('#application_url_title').val('');
        $('#application_url_value').val('');
        document.getElementById('responseMessageServerCommands').innerText = `Última Resposta do Servidor: ${message}`;
    });
};