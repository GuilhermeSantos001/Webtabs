/**
 * Import
 */
const [
    {
        ipcRenderer,
        remote
    },
    fs,
    path
] = [
        require('electron'),
        require('fs'),
        require('../import/localPath')
    ];

/**
 * Variables
 */
let [
    data,
    visibility
] = [
        null,
        null
    ]

/**
 * SCI ▲
 * 
 * Self Callers Initialize
 */
load();

/**
 * Functions
 */
function load() {
    let file = path.localPath('data/extensions/storage/dguard.json');
    if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file)) || {};
    } else {
        data = {
            "username": "moacyr",
            "password": "moacyr",
            "layout_cam": 3,
            "cam": 8
        }
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    }
};

function usernamechange() {
    let file = path.localPath('data/extensions/storage/dguard.json');
    if (!path.localPathExists('data/extensions/storage/dguard.json')) path.localPathCreate('data/extensions/storage/dguard.json');
    fs.writeFileSync(file, JSON.stringify({
        "username": String($('#form-dguard-username').val()),
        "password": String(data['password']),
        "layout_cam": Number(data['layout_cam']),
        "cam": Number(data['cam'])
    }, null, 2), 'utf8');
    data['username'] = $('#form-dguard-username').val();
};

function passwordchange() {
    let file = path.localPath('data/extensions/storage/dguard.json');
    if (!path.localPathExists('data/extensions/storage/dguard.json')) path.localPathCreate('data/extensions/storage/dguard.json');
    fs.writeFileSync(file, JSON.stringify({
        "username": String(data['username']),
        "password": String($('#form-dguard-password').val()),
        "layout_cam": Number(data['layout_cam']),
        "cam": Number(data['cam'])
    }, null, 2), 'utf8');
    data['password'] = $('#form-dguard-password').val();
};

/**
 * Process
 */
$('#layerExtension-DGuard').hide();

$(document).ready(() => {
    if (remote.Menu.getApplicationMenu().getMenuItemById(`layout_${data["layout_cam"]}`))
        remote.Menu.getApplicationMenu().getMenuItemById(`layout_${data["layout_cam"]}`).checked = true;

    if (remote.Menu.getApplicationMenu().getMenuItemById(`cam_${data["cam"]}`))
        remote.Menu.getApplicationMenu().getMenuItemById(`cam_${data["cam"]}`).checked = true;

    $('#form-dguard-username').val(data['username']);
    $('#form-dguard-password').val(data['password']);

    $('#form-dguard-username')
        .keypress(usernamechange)
        .keydown(usernamechange)
        .keyup(usernamechange);

    $('#form-dguard-password')
        .keypress(passwordchange)
        .keydown(passwordchange)
        .keyup(passwordchange);

    $('#form-dguard-password-visibility').click(() => {
        if (!visibility) {
            $('#form-dguard-password-visibility')
                .effect("shake")
                .animate({ color: "gray" }, "fast");
            document.getElementById('form-dguard-password-visibility').innerText = 'visibility_off';
            $('#form-dguard-password')
                .attr('type', 'text')
                .effect("shake");
            visibility = true;
        } else {
            $('#form-dguard-password-visibility')
                .effect("shake")
                .animate({ color: "white" }, "fast");
            document.getElementById('form-dguard-password-visibility').innerText = 'visibility';
            $('#form-dguard-password')
                .attr('type', 'password')
                .effect("shake");
            visibility = null;
        }
    });

    document.getElementById("button_extension_dguard_exit").onclick = function () {
        $('#layerExtension-DGuard').hide("fast");
    };
});

/**
 * Events
 */
ipcRenderer
    .on('extensions_dguard_window_configs', () => {
        $('#layerExtension-DGuard').show("fast");
    });