$(document).ready(function () {
    $('.modal').modal();
    $('.collapsible').collapsible();
    Materialize.updateTextFields();
    $('input#input_text, textarea#textarea1').characterCounter();
    $('select').material_select();
    restoreUserData();
});

function restoreUserData() {
    let data = JSON.parse(sessionStorage.getItem('userdata'));

    if (data && data['user'] && data['pass']) {
        $('#application_username').val(data['user']);
        $('#application_password').val(data['pass']);
        $('#application_store_user_data').attr('checked', true);
    }
}

function saveUserData() {
    let user = $('#application_username').val(),
        pass = $('#application_password').val();

    sessionStorage.setItem('userdata', JSON.stringify({ user, pass }));
}

document.getElementById('application_username').onkeyup = function () { saveUserData(); };

document.getElementById('application_password').onkeyup = function () { saveUserData(); };

document.getElementById('application_store_user_data').onclick = function () {
    if ($('#application_store_user_data').is(":checked")) {
        saveUserData();
    } else {
        sessionStorage.removeItem('userdata');
    }
};

function commandId() {
    let abc = ['a', 'b', 'c'],
        i = 0, l = 10,
        id = '';

    for (; i < l; i++) {
        id += abc[Math.floor(Math.random() * abc.length)];
    }

    return id;
}

document.getElementById('clearServerCommands').onclick = function () {
    let user = $('#application_username').val(),
        pass = $('#application_password').val();

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://192.168.0.104:3000/commands/clear",
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

document.getElementById('render_next').onclick = function () {
    let user = $('#application_username').val(),
        pass = $('#application_password').val();

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://192.168.0.104:3000/commands/register",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "system-code": "113195464d008eaf8e6b648574bd5306"
        },
        "processData": false,
        "data": `{\n\t\"id\": \"${commandId()}\",\n\t\"value\": \"render_next\",\n\t\"user\": \"${user}\",\n\t\"pass\": \"${pass}\"\n}`
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
};

document.getElementById('render_return').onclick = function () {
    let user = $('#application_username').val(),
        pass = $('#application_password').val();

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://192.168.0.104:3000/commands/register",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "system-code": "113195464d008eaf8e6b648574bd5306"
        },
        "processData": false,
        "data": `{\n\t\"id\": \"${commandId()}\",\n\t\"value\": \"render_return\",\n\t\"user\": \"${user}\",\n\t\"pass\": \"${pass}\"\n}`
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
};