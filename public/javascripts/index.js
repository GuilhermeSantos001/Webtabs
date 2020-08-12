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

const base_url = 'http://192.168.0.106:3000';

document.getElementById('clearServerCommands').onclick = function () {
    let user = $('#application_username').val(),
        pass = $('#application_password').val();

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": `${base_url}/commands/clear`,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "system-code": "113195464d008eaf8e6b648574bd5306"
        },
        "processData": false,
        "data": `{\n\t\"user\": \"${user}\",\n\t\"pass\": \"${pass}\"\n}`
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
};

[
    'render_next',
    'render_return',
    'render_fullscreen',
    'render_menubarshow',
    'render_menubarhide',
    'render_mouseshow',
    'render_mousehide',
    'render_frameedit',
    'render_framemanager',
    'render_running',
    'render_pause',
    'system_toogledevtools',
    'system_tooglereload'
].map(buttonName => {
    document.getElementById(buttonName).onclick = function () {
        let user = $('#application_username').val(),
            pass = $('#application_password').val();

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
            "data": `{\n\t\"id\": \"${commandId()}\",\n\t\"value\": \"${buttonName}\",\n\t\"user\": \"${user}\",\n\t\"pass\": \"${pass}\"\n}`
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    };
});