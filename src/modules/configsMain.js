import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';

let mainWindow = Electron.remote.getCurrentWindow();

$(document).ready(function () {
    $('#layerUrladd').fadeOut();
    document.getElementById("button_exit_url").onclick = function () {
        $('#layerUrladd').delay("fast").fadeOut("slow");
    };

    document.getElementById("button_add_url").onclick = function () {
        let fs = Electron.remote.require('fs'),
            path = Electron.remote.require('path'),
            file = path.resolve('src/config/data/urls.json');
        if (fs.existsSync(file)) {
            let data = JSON.parse(fs.readFileSync(file, 'utf8')) || [],
                url = $('#input_add_url').val() || '';
            if (!url || typeof url != 'string' || url.length <= 0) return;
            if (data instanceof Array === false) data = [];
            data.push([url, 0]);
            console.log(data);
            fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8', () => {
                mainWindow.webContents.send('add_url');
            });
        }
    };
});

Electron.ipcRenderer.on('window_configs_urls', () => {
    $('#layerUrladd').fadeIn("slow");
});