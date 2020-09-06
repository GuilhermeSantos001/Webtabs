/**
 * Import
 */
const [{
        remote,
        ipcRenderer,
        desktopCapturer
    },
    path,
    ALERT,
    bytesToSize,
    fs,
    menuManager,
    controller
] = [
    require('electron'),
    require('../import/localPath'),
    require('../import/alert'),
    require('../import/bytesToSize'),
    require('fs'),
    require('../import/MenuManager'),
    require('../import/controller')
];

/**
 * Variables
 */
let [
    data_urls,
    mainWindow
] = [
    null,
    remote.getCurrentWindow()
]

/**
 * SCI ▲
 * 
 * Self Callers Initialize
 */
createDataURLs();

/**
 * Functions
 */
function createDataURLs() {
    if (!path.localPathExists('storage/urls.json')) path.localPathCreate('storage/urls.json');
    if (fs.existsSync(path.localPath('storage/urls.json'))) {
        data_urls = JSON.parse(fs.readFileSync(path.localPath('storage/urls.json'), 'utf-8')) || [];
    } else {
        data_urls = [];
        fs.writeFileSync(path.localPath('storage/urls.json'), Buffer.from(JSON.stringify(data_urls), 'utf-8'), {
            flag: 'w+'
        });
    }
};

function BTN_SCREEN_SELECTION_EXIST(id, name) {
    for (const btn of data_urls) {
        if (typeof btn[0] === 'object')
            if (btn[0].id === id && btn[0].name === name) return true;
    }
    return false;
};

function SCREEN_SELECTION_UPDATE() {
    desktopCapturer.getSources({
        types: ['window', 'screen']
    }).then(async sources => {
        let i = 1,
            l = sources.filter(source => source.id.includes('screen')).length;
        for (const source of sources) {
            if (document.getElementById(source.id) === null && source.id.includes('screen')) {
                $('#screen_selection').append(`<button type="button" id="${source.id}" class="btn btn-lg btn-block btn-outline-light mt-2 col-12 text-center text-uppercase font-weight-bold text-wrap" style="font-size: 1.2rem;" ${l <= 1 ? "disabled" : ""}>Monitor ${i++}</button>`);
                let btn = document.getElementById(source.id);
                btn.onclick = function () {
                    let file = path.localPath('storage/urls.json');
                    if (!path.localPathExists('storage/urls.json')) path.localPathCreate('storage/urls.json');
                    if (fs.existsSync(file)) {
                        data_urls.push([{
                            type_url: 'stream',
                            id: source.id,
                            name: source.name,
                            title: `Monitor ${i - 1}`
                        }]);
                        fs.writeFileSync(file, Buffer.from(JSON.stringify(data_urls), 'utf-8'), {
                            flag: 'w+'
                        });
                        $(btn).prop('disabled', true);
                        mainWindow.webContents.send('add_url');
                    }
                };
                if (BTN_SCREEN_SELECTION_EXIST(source.id, source.name)) $(btn).prop('disabled', true);
            }
        }
    });
};

/**
 * Process
 */
$('#layerUrladd').hide();

$(document).ready(function () {
    document.getElementById("button_exit_url").onclick = function () {
        $('#layerUrladd').animate({
            "height": "0vh",
            "opacity": 0
        }, "fast").hide("fast");
        menuManager.clear();
    };

    $('#input_add_photo').on('change', function () {
        $('#show_filePath_photo').text(document.getElementById('input_add_photo').files[0].path);
        $('#size_file_photo').text(`Tamanho do arquivo: ${bytesToSize(document.getElementById('input_add_photo').files[0].size, 2)}`);
    });

    document.getElementById("button_add_photo").onclick = function () {
        let file = path.localPath('storage/urls.json');
        if (!path.localPathExists('storage/urls.json')) path.localPathCreate('storage/urls.json');
        if (fs.existsSync(file)) {
            let url = document.getElementById('input_add_photo').files[0].path || '',
                fileName = document.getElementById('input_add_photo').files[0].name;
            if (!url || typeof url != 'string' || url.length <= 0) return;
            if (fs.existsSync(url)) {
                data_urls.push([{
                    url,
                    type_url: 'image'
                }]);
                fs.writeFileSync(file, Buffer.from(JSON.stringify(data_urls), 'utf-8'), {
                    flag: 'w+'
                });
                $('#input_add_photo').val('');
                $('#show_filePath_photo').text('Procurar Imagem...');
                $('#size_file_photo').text('');
                ALERT.info('', `A sua imagem "${fileName}" foi adicionada com sucesso!!!`);
                mainWindow.webContents.send('add_url');
            }
        }
    };

    document.getElementById("button_add_url").onclick = function () {
        let filepath = path.localPath('storage/urls.json');
        if (!path.localPathExists('storage/urls.json')) path.localPathCreate('storage/urls.json');
        if (fs.existsSync(filepath)) {
            let url = $('#input_add_url').val() || '',
                title = $('#input_add_url_title').val() || false;
            if (!url || typeof url != 'string' || url.length <= 0) return;
            controller.frameAddURL(filepath, data_urls, title, url)
                .then((data) => {
                    $('#input_add_url').val('');
                    $('#input_add_url_title').val('');
                    data_urls = data;
                    mainWindow.webContents.send('add_url');
                });
        }
    };
    SCREEN_SELECTION_UPDATE();
});

/**
 * Events
 */
ipcRenderer
    .on('window_configs_urls', () => {
        if (menuManager.isClear()) {
            SCREEN_SELECTION_UPDATE();
            $('#layerUrladd').show("fast").animate({
                "height": "100vh",
                "opacity": 100
            }, "fast");
            menuManager.setMenu('configsUrls');
        } else {
            if (menuManager.isMenu('configsUrls')) {
                $('#button_exit_url').click();
            }
        }
    });