/**
 * Import
 */
const [{
        ipcRenderer,
        remote
    },
    fs,
    path,
    LZString
] = [
    require('electron'),
    require('fs'),
    require('../import/localPath'),
    require('../import/LZString')
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
loadData();
createscript();

/**
 * Functions
 */
function loadData() {
    let file = path.localPath('extensions/storage/dguard.json');
    if (!path.localPathExists('extensions/storage/dguard.json')) path.localPathCreate('extensions/storage/dguard.json');
    if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file)) || {};
    } else {
        data = {
            "username": "",
            "password": "",
            "layout_cam": 0,
            "cam": 0
        }
        fs.writeFileSync(file, Buffer.from(JSON.stringify(data), 'utf-8'), {flag: 'w+'});
    }
};

function createscript() {
    let script = "$(document).ready(() => {\n\
        $(document.getElementsByName('username')[0]).val('__NAME__VALUE__');\n\
        $(document.getElementsByName('username')[0]).change();\n\
        \
        $(document.getElementsByName('password')[0]).val('__PASS__VALUE__');\n\
        $(document.getElementsByName('password')[0]).change();\n\
        \
        let intervals = [],\n\
            reset = false;\n\
        intervals[0] = setInterval(function () {\n\
            if ($($('#errors').children()[0]).is(':visible')) {\n\
                if (!reset) $('#errors').prepend('<p id=\"reset\"></p>'), reset = true;\n\
            } else {\n\
                if (reset) $('#reset').remove(), reset = false;\n\
            }\n\
            try {\n\
                if ($(document.getElementsByClassName('md-primary md-raised md-button md-dguardlight-theme md-ink-ripple')[0]).length > 0) {\n\
                    $(document.getElementsByClassName('md-primary md-raised md-button md-dguardlight-theme md-ink-ripple')[0]).delay().click();\n\
                }\n\
                if ($(document.getElementsByClassName('layout-row')[3]).children()[0]) {\n\
                    $(document.getElementsByClassName('layout-row')[3]).children()[0].click();\n\
                }\n\
                document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')[0].click();\n\
                document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')['__LAYOUT_CAM__VALUE__'].click();\n\
                clearInterval(intervals[0]);\n\
                intervals[1] = setInterval(function () {\n\
                    try {\n\
                        document.getElementsByClassName('md-no-style md-button md-dguardlight-theme md-ink-ripple flex')['__CAM__VALUE__'].click();\n\
                        document.webtabs = true;\n\
                        clearInterval(intervals[1]);\n\
                        intervals = null;\n\
                    } catch (e) { console.error(e); }\n\
                }, 1000);\n\
            } catch (e) { console.error(e); };\n\
        }, 1000);\n\
    });",
        file = path.localPath('extensions/scripts/dguard.js');
    if (!path.localPathExists('extensions/scripts/dguard.js')) path.localPathCreate('extensions/scripts/dguard.js');
    fs.writeFileSync(file, Buffer.from(LZString.compressToBase64(script), 'utf-8'), {flag: 'w+'});
};

function usernamechange() {
    let file = path.localPath('extensions/storage/dguard.json');
    if (!path.localPathExists('extensions/storage/dguard.json')) path.localPathCreate('extensions/storage/dguard.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "username": String($('#form-dguard-username').val()),
        "password": String(data['password']),
        "layout_cam": Number(data['layout_cam']),
        "cam": Number(data['cam'])
    }), 'utf-8'), {flag: 'w+'});
    data['username'] = $('#form-dguard-username').val();
};

function passwordchange() {
    let file = path.localPath('extensions/storage/dguard.json');
    if (!path.localPathExists('extensions/storage/dguard.json')) path.localPathCreate('extensions/storage/dguard.json');
    fs.writeFileSync(file, Buffer.from(JSON.stringify({
        "username": String(data['username']),
        "password": String($('#form-dguard-password').val()),
        "layout_cam": Number(data['layout_cam']),
        "cam": Number(data['cam'])
    }), 'utf-8'), {flag: 'w+'});
    data['password'] = $('#form-dguard-password').val();
};

/**
 * Process
 */
$('#layerExtension-DGuard').hide();

$(document).ready(() => {
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
                .animate({
                    color: "gray"
                }, "fast");
            document.getElementById('form-dguard-password-visibility').innerText = 'visibility_off';
            $('#form-dguard-password')
                .attr('type', 'text')
                .effect("shake");
            visibility = true;
        } else {
            $('#form-dguard-password-visibility')
                .effect("shake")
                .animate({
                    color: "white"
                }, "fast");
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

    document.getElementById("button_extension_dguard_remove_frame").onclick = function () {
        $("#button_extension_dguard_remove_frame")
            .effect("bounce")
            .prop('disabled', true)
            .html(`Excluindo...`);
    };
});

/**
 * Events
 */
ipcRenderer
    .on('extensions_dguard_window_configs', () => {
        $('#layerExtension-DGuard').show("fast");
    })
    .on('extensions_dguard_menu_update_checked', () => {
        loadData();
        if (remote.Menu.getApplicationMenu().getMenuItemById(`layout_${data["layout_cam"]}`))
            remote.Menu.getApplicationMenu().getMenuItemById(`layout_${data["layout_cam"]}`).checked = true;

        if (remote.Menu.getApplicationMenu().getMenuItemById(`cam_${data["cam"]}`))
            remote.Menu.getApplicationMenu().getMenuItemById(`cam_${data["cam"]}`).checked = true;
    });