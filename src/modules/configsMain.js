import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';
import { localPath, localPathExists, localPathCreate } from './localPath';

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
            data.push([url, 0]);
            fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8', () => {
                $('#input_add_url').val('');
                mainWindow.webContents.send('add_url');
            });
        }
    };
});

Electron.ipcRenderer.on('window_configs_urls', () => {
    $('#layerUrladd').show("fast");
});