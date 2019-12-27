/**
 * Import
 */
const [
    {
        remote,
        ipcRenderer,
        desktopCapturer
    },
    path,
    ALERT,
    chkurl,
    fs
] = [
        require('electron'),
        require('../import/localPath'),
        require('../import/alert'),
        require('../import/checking_url'),
        require('fs'),
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
    if (!path.localPathExists(path.localPath('data/storage/urls.json'))) path.localPathCreate(path.localPath('data/storage/urls.json'));
    if (fs.existsSync(path.localPath('data/storage/urls.json'))) {
        data_urls = JSON.parse(fs.readFileSync(path.localPath('data/storage/urls.json'), 'utf8')) || [
            [
                "https://grupomave2.pipedrive.com/pipeline/1/user/everyone",
                0
            ],
            [
                "https://sla.performancelab.com.br/login.php?uri=%2F",
                0
            ]
        ];
    } else {
        data_urls = [
            [
                "https://grupomave2.pipedrive.com/pipeline/1/user/everyone",
                0
            ],
            [
                "https://sla.performancelab.com.br/login.php?uri=%2F",
                0
            ]
        ];
        fs.writeFileSync(path.localPath('data/storage/urls.json'), JSON.stringify(data_urls, null, 2), 'utf8');
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
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        console.log(sources);
        for (const source of sources) {
            if (document.getElementById(source.id) === null && source.id.includes('screen')) {
                $('#screen_selection').append(`<button type="button" id="${source.id}" class="btn btn-lg btn-block btn-outline-light mt-2 col-12 text-center text-uppercase font-weight-bold text-wrap" style="font-size: 1.2rem;">${source.name}</button>`);
                let btn = document.getElementById(source.id);
                btn.onclick = function () {
                    let file = path.localPath('data/storage/urls.json');
                    if (!path.localPathExists(file)) path.localPathCreate(file);
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
};

/**
 * Process
 */
$('#layerUrladd').hide();

$(document).ready(function () {
    document.getElementById("button_exit_url").onclick = function () {
        $('#layerUrladd').hide("fast");
    };

    document.getElementById("button_add_url").onclick = function () {
        let file = path.localPath('data/storage/urls.json');
        if (!path.localPathExists(file)) path.localPathCreate(file);
        if (fs.existsSync(file)) {
            let url = $('#input_add_url').val() || '';
            if (!url || typeof url != 'string' || url.length <= 0) return;
            chkurl(url, e => {
                if (!e) {
                    return ALERT.info(`A URL "${url}" não pode ser adicionada!!!`);
                }
                data.push([url, 0]);
                fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8', () => {
                    $('#input_add_url').val('');
                    ALERT.info(`A URL "${url}" foi adicionada com sucesso!!!`);
                    mainWindow.webContents.send('add_url');
                });
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
        SCREEN_SELECTION_UPDATE();
        $('#layerUrladd').show("fast");
    });