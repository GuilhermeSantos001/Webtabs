import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';
import { localPath, localPathExists, localPathCreate } from './localPath';
import * as Alert from './alert';
import chkurl from './checking_url';

let data;
if (!localPathExists(localPath('src/config/data/urls.json'))) localPathCreate(localPath('src/config/data/urls.json'));
if (Electron.remote.require('fs').existsSync(localPath('src/config/data/urls.json'))) {
    data = JSON.parse(Electron.remote.require('fs').readFileSync(localPath('src/config/data/urls.json'), 'utf8')) || [];
} else {
    data = [
        [
            "https://grupomave2.pipedrive.com/pipeline/1/user/everyone",
            0
        ],
        [
            "https://sla.performancelab.com.br/login.php?uri=%2F",
            0
        ]
    ];
    Electron.remote.require('fs').writeFileSync(localPath('src/config/data/urls.json'), JSON.stringify(data, null, 2), 'utf8');
}

let mainWindow = Electron.remote.getCurrentWindow();

$('#layerUrladd').hide();

$(document).ready(function () {
    document.getElementById("button_exit_url").onclick = function () {
        $('#layerUrladd').hide("fast");
    };

    document.getElementById("button_add_url").onclick = function () {
        let fs = Electron.remote.require('fs'),
            file = localPath('src/config/data/urls.json');
        if (!localPathExists(file)) localPathCreate(file);
        if (fs.existsSync(file)) {
            let url = $('#input_add_url').val() || '';
            if (!url || typeof url != 'string' || url.length <= 0) return;
            chkurl(url, e => {
                if (!e) {
                    return Alert.info(`A URL "${url}" não pode ser adicionada!!!`);
                }
                data.push([url, 0]);
                fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8', () => {
                    $('#input_add_url').val('');
                    Alert.info(`A URL "${url}" foi adicionada com sucesso!!!`);
                    mainWindow.webContents.send('add_url');
                });
            });
        }
    };
    SCREEN_SELECTION_UPDATE();
});

Electron.ipcRenderer.on('window_configs_urls', () => {
    SCREEN_SELECTION_UPDATE();
    $('#layerUrladd').show("fast");
});

/**
 * Functions
 */

function BTN_SCREEN_SELECTION_EXIST(id, name) {
    for (const btn of data) {
        if (typeof btn[0] === 'object')
            if (btn[0].id === id && btn[0].name === name) return true;
    }
    return false;
}

function SCREEN_SELECTION_UPDATE() {
    const { desktopCapturer } = Electron;
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        console.log(sources);
        for (const source of sources) {
            if (document.getElementById(source.id) === null && source.id.includes('screen')) {
                $('#screen_selection').append(`<button type="button" id="${source.id}" class="btn btn-lg btn-block btn-outline-light mt-2 col-12 text-center text-uppercase font-weight-bold text-wrap" style="font-size: 1.2rem;">${source.name}</button>`);
                let btn = document.getElementById(source.id);
                btn.onclick = function () {
                    let fs = Electron.remote.require('fs'),
                        file = localPath('src/config/data/urls.json');
                    if (!localPathExists(file)) localPathCreate(file);
                    if (fs.existsSync(file)) {
                        data.push([{
                            type_url: 'stream',
                            id: source.id
                        }]);
                        fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8', () => {
                            $(btn).prop('disabled', true);
                            mainWindow.webContents.send('add_url');
                        });
                    }
                };
                if (BTN_SCREEN_SELECTION_EXIST(source.id, source.name))
                    $(btn).prop('disabled', true);
            }
        }
    });
}