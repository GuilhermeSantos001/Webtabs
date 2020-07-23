/**
 * Import
 */
const [{
    remote,
    ipcRenderer
},
    path,
    ALERT,
    fs,
    menuManager,
    controller
] = [
        require('electron'),
        require('../import/localPath'),
        require('../import/alert'),
        require('fs'),
        require('../import/MenuManager'),
        require('../import/controller')
    ];

/**
 * Process
 */
$('.layerFrame').append(fs.readFileSync(path.localPath('bin\\menus\\html\\contentsManager.html', true), 'utf8'));

/**
 * Events
 */
ipcRenderer
    .on('window_contents_manager', () => {
        console.log(controller.frameEmpty());
        if (menuManager.isClear()) {
            $('#layerContentsManager').show("fast").animate({
                "height": "100vh",
                "opacity": 100
            }, "fast");
            menuManager.setMenu('contentsManager');
            remote.getCurrentWindow().webContents.send('render_framePause');
            initialize();
        } else {
            if (menuManager.isMenu('contentsManager')) {
                $('#button_exit_contentsManager').click();
            }
        }
    })
    .on('window_contents_manager_menu_clear', () => { menuManager.clear(); });