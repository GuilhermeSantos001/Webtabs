/**
 * Import
 */
const [
    {
        ipcRenderer,
        remote
    },
    path,
    fs,
    DeveloperMode
] = [
        require('electron'),
        require('./bin/import/localPath'),
        require('fs'),
        require('./bin/import/DeveloperMode')
    ];

/**
 * Variables
 */
let [
    data,
    height
] = [
        ,
        $('#layerContent').height()
    ];

/**
 * SCI ▲
 * 
 * Self Callers Initialize
 */
loadConfigGlobal();
animatelayerContent();

/**
 * Functions
 */
function loadConfigGlobal() {
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    if (fs.existsSync(path.localPath('configs/global.json'))) {
        data = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf8')) || [];
    } else {
        data = {
            "APPNAME": "WEBTABS",
            "TITLE": "GRUPO MAVE 2020",
            "SLOGAN": "Você e seu Patrimônio em boas mãos!",
            "VERSION": "v5.31.33-build",
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2,
            "LOGO": "assets/img/logo.png"
        }
        fs.writeFileSync(path.localPath('configs/global.json'), JSON.stringify(data, null, 2), 'utf8');
    };
};

function animatelayerContent() {
    let file = path.localPath('storage/framereload.json');
    if (!fs.existsSync(file)) {
        $('#layerContent')
            .animate({ "margin-top": `-=${height}`, opacity: 0 })
            .delay(1000).animate({ "margin-top": `+=${height}`, opacity: 100 }, 'slow')
            .delay(2000).animate({ "margin-top": `-=${height}`, opacity: 0 }, 'slow', function () {
                $('#layerContent').hide();
            });
    } else {
        $('#layerContent').hide();
    }
};

/**
 * Process
 */
document.title = data.APPNAME;
document.getElementById('title').innerText = data.TITLE;
document.getElementById('slogan').innerText = data.SLOGAN;
document.getElementById('version').innerText = data.VERSION;

$(document).ready(function () {
    $('#layerContainer').fadeOut(function () { $('#layerContainer').css('filter', 'opacity(100%)'); }).delay().fadeIn('slow');
});

console.log(
    '%c✩%c✩%c✩ %cWEBTABS %c✩%c✩%c✩',
    'font-size: 250%; color: #292929;',
    'font-size: 290%; color: #292929;',
    'font-size: 250%; color: #292929;',
    'color: #501cc9; font-size: 300%;',
    'font-size: 250%; color: #292929;',
    'font-size: 290%; color: #292929;',
    'font-size: 250%; color: #292929;',
);

if (DeveloperMode.getDevToolsDeveloperMode()) {
    console.log('%c🔬 AMBIENTE DE DESENVOLVIMENTO - v5.31.33-build 📜', 'color: #f03c3c; padding: 8px; font-size: 200%;');
} else {
    console.log('%c📛 VERSÃO EM EXECUÇÃO - v5.31.33-build ♨️', 'color: #f03c3c; padding: 8px; font-size: 200%;');
}

/**
 * Events & Callers
 */
ipcRenderer
    .on('show_scroll_page', () => {
        $('html, body').css('overflowX', 'auto');
        $('html, body').css('overflowY', 'auto');
        try { $('.layerFrame').children()[0].insertCSS('body, html { overflow-y: auto; overflow-x: auto; }'); } catch (e) { };

    })
    .on('hide_scroll_page', () => {
        $('html, body').css('overflowX', 'hidden');
        $('html, body').css('overflowY', 'hidden');
        try { $('.layerFrame').children()[0].insertCSS('body, html { overflow-y: hidden; overflow-x: hidden; }'); } catch (e) { };
    })
    .on('window_show_cursor', () => {
        remote.getCurrentWindow().webContents.insertCSS('* { cursor: auto; pointer-events: auto; user-select: auto;}');
    })
    .on('window_hide_cursor', () => {
        remote.getCurrentWindow().webContents.insertCSS('* { cursor: none; pointer-events: none; user-select: none;}');
    })
    .send('menu_started');

/**
 * Import Sources
 */
require('./bin/sources/loadurls');
require('./bin/sources/configsMain');
require('./bin/sources/configsGlobal');
require('./bin/sources/contentsManager');

/**
 * Import Extensions
 */
require('./bin/extensions/load');