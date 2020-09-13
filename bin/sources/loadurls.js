/**
 * Import
 */
const [{
        remote,
        ipcRenderer,
        desktopCapturer
    },
    path,
    fs,
    DeveloperMode,
    ALERT,
    DATE,
    LZString,
    menuManager,
    controller
] = [
    require('electron'),
    require('../import/localPath'),
    require('fs'),
    require('../import/DeveloperMode'),
    require('../import/alert'),
    require('../classes/tick'),
    require('../import/LZString'),
    require('../import/MenuManager'),
    require('../import/controller')
];

/**
 *  Variables
 */
let [
    ConfigGlobal,
    data_urls,
    web_cookies,
    menu,
    frame,
    interval,
    fileProcess,
    urls,
    cookies,
    i,
    ProcessInterval,
    framePauseValue,
    tick
] = [
    null,
    null,
    null,
    remote.Menu.getApplicationMenu(),
    null,
    null,
    null,
    null,
    null,
    0,
    null,
    null,
    [0, 10]
];

/**
 * SCI ▲
 * 
 * Self Callers Initialize
 */
createConfigGlobal();
createDataURLs();
createWebCookies();
loadDataURLs();

/**
 *  Functions
 */
async function createConfigGlobal() {
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    if (fs.existsSync(path.localPath('configs/global.json'))) {
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf-8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "CONNECTIONTYPE": "http",
            "SERVERIP": "localhost",
            "SERVERPORT": "3000",
            "APISYSTEMCODE": "113195464d008eaf8e6b648574bd5306",
            "SERVERLOGINUSER": "admin",
            "SERVERLOGINPASS": "123",
            "TITLE": "WEBTABS",
            "SLOGAN": "Visualizar suas páginas favoritas como slides, nunca foi tão fácil.",
            "VERSION": controller.versionSystem,
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2,
            "LOGO": "assets/img/logo.png"
        }
        await fs.writeFileSync(path.localPath('configs/global.json'), Buffer.from(JSON.stringify(ConfigGlobal), 'utf-8'), {
            flag: 'w+'
        });
    }
};

async function createDataURLs() {
    if (!path.localPathExists('storage/urls.json')) path.localPathCreate('storage/urls.json');
    if (fs.existsSync(path.localPath('storage/urls.json'))) {
        data_urls = JSON.parse(fs.readFileSync(path.localPath('storage/urls.json'), 'utf-8')) || [];
    } else {
        data_urls = [];
        await fs.writeFileSync(path.localPath('storage/urls.json'), Buffer.from(JSON.stringify(data_urls), 'utf-8'), {
            flag: 'w+'
        });
    }
};

async function createWebCookies() {
    if (!path.localPathExists('storage/webcookies.json')) path.localPathCreate('storage/webcookies.json');
    if (fs.existsSync(path.localPath('storage/webcookies.json'))) {
        web_cookies = JSON.parse(fs.readFileSync(path.localPath('storage/webcookies.json'), 'utf-8')) || {
            'size': 0
        };
    } else {
        web_cookies = {
            'size': 0
        };
        await fs.writeFileSync(path.localPath('storage/webcookies.json'), Buffer.from(JSON.stringify(web_cookies), 'utf-8'), {
            flag: 'w+'
        });
    }
};

/**
 * Data Urls
 */
async function saveDataURLs() {
    let file = path.localPath('storage/urls.json');
    if (path.localPathExists('storage/urls.json')) {
        fileProcess = 'write...';
        await fs.writeFileSync(file, Buffer.from(JSON.stringify(urls), 'utf-8'), {
            flag: 'w+'
        });
        fileProcess = 'done';
        saveWebCookies();
    }
};

function loadDataURLs() {
    let file = path.localPath('storage/urls.json');
    if (path.localPathExists('storage/urls.json')) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        if (data instanceof Array === true) {
            fileProcess = 'done';
            urls = data;
            loadWebCookies();
        }
    }
};

async function removeDataURLs(i) {
    let file = path.localPath('storage/urls.json');
    if (path.localPathExists('storage/urls.json')) {
        fileProcess = 'write...';
        if (urls[i] instanceof Array) {
            let cookie = urls[i][2];
            urls.splice(i, 1);
            await fs.writeFileSync(file, Buffer.from(JSON.stringify(urls), 'utf-8'), {
                flag: 'w+'
            });
            fileProcess = 'done';
            removeWebCookies(cookie);
        }
    }
};

/**
 * Webcookies
 */
async function saveWebCookies() {
    let file = path.localPath('storage/webcookies.json');
    if (path.localPathExists('storage/webcookies.json')) {
        fileProcess = 'write...';
        await fs.writeFileSync(file, Buffer.from(JSON.stringify(cookies), 'utf-8'), {
            flag: 'w+'
        });
        fileProcess = 'done';
    }
};

function loadWebCookies() {
    let file = path.localPath('storage/webcookies.json');
    if (path.localPathExists('storage/webcookies.json')) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        if (data instanceof Object === true) {
            fileProcess = 'done';
            cookies = data;
        }
    }
};

async function removeWebCookies(cookie) {
    let file = path.localPath('storage/webcookies.json');
    if (path.localPathExists('storage/webcookies.json')) {
        fileProcess = 'write...';
        if (cookie === 'string') {
            if (cookies[cookie] instanceof Array) delete cookies[cookie];
            await fs.writeFileSync(file, Buffer.from(JSON.stringify(cookies), 'utf-8'), {
                flag: 'w+'
            });
            fileProcess = 'done';
        } else {
            await fs.unlinkSync(file);
            fileProcess = 'done';
        }
    }
};

/**
 * Frame Reload
 */
function framereload() {
    let file = path.localPath('storage/framereload.json');
    if (fs.existsSync(file)) {
        let __data = JSON.parse(fs.readFileSync(file)) || {};
        if (__data['cache']) i = Number(__data['cache']);
        fs.unlinkSync(file);
    }
};

/**
 * Frame Pause
 */
function frameIsPause() {
    return framePauseValue || menu.getMenuItemById('PAUSE').checked;
}

function framePause() {
    if (menu.getMenuItemById('PAUSE').checked) return;
    framePauseValue = true;
}

function frameResume() {
    if (menu.getMenuItemById('PAUSE').checked) return;
    framePauseValue = null;
}

/**
 * Process
 */
/**
 * Frame
 */
function removeFrame() {
    if (urls.length <= 0) return;
    if (frame) {
        if (
            frame.removeProcess ||
            frame.fadeInInitial === 'processing...'
        ) return;
        frame.removeProcess = true;
        $(frame).fadeOut('slow', function () {
            if (typeof urls[i - 1][0] === 'string') {
                urls[i - 1][0] = frame.getURL();
                urls[i - 1][1] = frame.getZoomLevel();
                if (typeof urls[i - 1][2] != 'string') urls[i - 1][2] = `cookie_${++cookies.size}`;
                if (String(urls[i - 1][2]).toLowerCase() === 'dguard') return finish(true);
                remote.getCurrentWindow().webContents.session.cookies.get({
                        url: urls[i - 1][0]
                    })
                    .then((data) => {
                        return finish(true, data);
                    }).catch((error) => {
                        if (DeveloperMode.getDevToolsDeveloperMode() &&
                            DeveloperMode.getDevToolsMode('errors_system')) console.log(error);
                    });
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                return finish(false);
            }

            function finish(listener, data) {
                if (data) cookies[urls[i - 1][2]] = data;
                if (urls.length - 1 <= 0) i = 0;
                else if (i + 1 > urls.length) i = 0;
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
                if (controller.action('control_server_render_process')) {
                    controller.defineAction('control_server_render_process', false);
                    controller.defineAction('control_server_initialize', false);
                    controller.serverCommandsClear(controller.action('control_server_command_id'));
                }
                /**
                 * Update Menu Extensions
                 */
                /**
                 * D-Guard
                 */
                ipcRenderer.send('extensions_dguard_menu_close');
            }
        });
    }
};

function returnFrame() {
    if (urls.length <= 0) return;
    if (frame) {
        if (
            frame.removeProcess ||
            frame.fadeInInitial === 'processing...'
        ) return;
        frame.removeProcess = true;
        $(frame).fadeOut('slow', function () {
            if (typeof urls[i - 1][0] === 'string') {
                urls[i - 1][0] = frame.getURL();
                urls[i - 1][1] = frame.getZoomLevel();
                if (typeof urls[i - 1][2] != 'string') urls[i - 1][2] = `cookie_${++cookies.size}`;
                if (String(urls[i - 1][2]).toLowerCase() === 'dguard') return finish(true);
                remote.getCurrentWindow().webContents.session.cookies.get({})
                    .then((data) => {
                        return finish(true, data);
                    }).catch((error) => {
                        if (DeveloperMode.getDevToolsDeveloperMode() &&
                            DeveloperMode.getDevToolsMode('errors_system')) console.log(error);
                    });
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                return finish(false);
            }

            function finish(listener, data) {
                if (data) cookies[urls[i - 1][2]] = data;
                if (urls.length - 1 <= 0) i = 0;
                else if (i > 1) {
                    i = i - 2 < 0 ? 0 : i - 2;
                }
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
                if (controller.action('control_server_render_process')) {
                    controller.defineAction('control_server_render_process', false);
                    controller.defineAction('control_server_initialize', false);
                    controller.serverCommandsClear(controller.action('control_server_command_id'));
                }
                /**
                 * Update Menu Extensions
                 */
                /**
                 * D-Guard
                 */
                ipcRenderer.send('extensions_dguard_menu_close');
            }
        });
    }
};

function flushFrame() {
    if (urls.length <= 0) return;
    if (frame) {
        if (
            frame.removeProcess ||
            frame.fadeInInitial === 'processing...'
        ) return;
        frame.removeProcess = true;
        let __i = i > 1 ? i - 1 : i;
        $(frame).fadeOut('slow', function () {
            if (typeof urls[__i][0] === 'string') {
                urls[__i][0] = frame.getURL();
                urls[__i][1] = frame.getZoomLevel();
                if (typeof urls[__i][2] != 'string') urls[__i][2] = `cookie_${++cookies.size}`;
                if (String(urls[__i][2]).toLowerCase() === 'dguard') return finish(true);
                remote.getCurrentWindow().webContents.session.cookies.get({})
                    .then((data) => {
                        return finish(true, data);
                    }).catch((error) => {
                        if (DeveloperMode.getDevToolsDeveloperMode() &&
                            DeveloperMode.getDevToolsMode('errors_system')) console.log(error);
                    });
            } else if (
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'stream' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'image' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'video'
            ) {
                return finish(false);
            }

            function finish(listener, data) {
                if (data) cookies[urls[__i][2]] = data;
                if (urls.length - 1 <= 0) i = 0;
                else i = __i;
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
                if (controller.action('control_server_render_process')) {
                    controller.defineAction('control_server_render_process', false);
                    controller.defineAction('control_server_initialize', false);
                    controller.serverCommandsClear(controller.action('control_server_command_id'));
                }
                /**
                 * Update Menu Extensions
                 */
                /**
                 * D-Guard
                 */
                ipcRenderer.send('extensions_dguard_menu_close');
            }
        });
    }
}

function deleteFrame(extensions) {
    if (urls.length <= 0) return;
    /**
     * Process
     */
    if (frame) {
        if (
            frame.removeProcess ||
            frame.fadeInInitial === 'processing...'
        ) return;
        frame.removeProcess = true;
        let __i = i > 1 ? i - 1 : i;
        /**
         * Extensions
         */
        /**
         * D-Guard
         */
        if (extensions === 'dguard') {
            return $(frame).fadeOut('slow', function () {
                if (urls.length - 1 <= 0) i = 0;
                else i = __i;
                clearInterval(interval), interval = null;
                if (frame.listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
                if (controller.action('control_server_render_process')) {
                    controller.defineAction('control_server_render_process', false);
                    controller.defineAction('control_server_initialize', false);
                    controller.serverCommandsClear(controller.action('control_server_command_id'));
                }
                /**
                 * Update Menu Extensions
                 */
                /**
                 * D-Guard
                 */
                ipcRenderer.send('extensions_dguard_menu_close');
                removeDataURLs(i);
                $("#button_extension_dguard_remove_frame")
                    .effect("bounce")
                    .prop('disabled', false)
                    .html(`Remover o D-Guard`);
            });
        }

        $(frame).fadeOut('slow', function () {
            if (typeof urls[__i][0] === 'string') {
                urls[__i][0] = frame.getURL();
                urls[__i][1] = frame.getZoomLevel();
                if (typeof urls[__i][2] != 'string') urls[__i][2] = `cookie_${++cookies.size}`;
                if (String(urls[__i][2]).toLowerCase() === 'dguard') return finish(true);
                remote.getCurrentWindow().webContents.session.cookies.get({})
                    .then((data) => {
                        return finish(true, data);
                    }).catch((error) => {
                        if (DeveloperMode.getDevToolsDeveloperMode() &&
                            DeveloperMode.getDevToolsMode('errors_system')) console.log(error);
                    });
            } else if (
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'stream' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'image' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'video'
            ) {
                return finish(false);
            }

            function finish(listener, data) {
                if (data) cookies[urls[__i][2]] = data;
                if (urls.length - 1 <= 0) i = 0;
                else i = __i;
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
                if (controller.action('control_server_render_process')) {
                    controller.defineAction('control_server_render_process', false);
                    controller.defineAction('control_server_initialize', false);
                    controller.serverCommandsClear(controller.action('control_server_command_id'));
                }
                /**
                 * Update Menu Extensions
                 */
                /**
                 * D-Guard
                 */
                ipcRenderer.send('extensions_dguard_menu_close');
                removeDataURLs(i);
            }
        });
    }
}

function DESKTOPCAPTURER() {
    desktopCapturer.getSources({
        types: ['window', 'screen']
    }).then(async sources => {
        for (const source of sources) {
            if (source.id === urls[i][0]["id"]) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                maxWidth: 1980,
                                maxHeight: 1080,
                                minWidth: 1280,
                                minHeight: 720
                            }
                        }
                    });
                    desktopCapturer_handleStream(stream);
                    break;
                } catch (e) {
                    desktopCapturer_handleError(e);
                    break;
                }
            } else {
                /**
                 * Faz a exclusão do monitor no arquivo de configuração
                 * caso o mesmo não seja encontrado no sistema.
                 */
                let remove = true;
                sources.map(source => {
                    if (urls[i][0]["type_url"] === "stream") {
                        if (source.id == urls[i][0]["id"]) {
                            remove = false;
                        }
                    }
                });
                if (remove) remove_url(i);
            }
        }
    });

    function desktopCapturer_handleStream(stream) {
        $('.layerFrame').append(`<video id="stream" style="z-index: 1; display:inline-flexbox; filter:opacity(0%);" />`);

        let $video = $('#stream'),
            $window = $(window);

        $window.resize(function () {

            let height = $window.height();
            $video.css('height', height);

            let videoWidth = $video.width(),
                windowWidth = $window.width(),
                marginLeftAdjust = (windowWidth - videoWidth) / 2;

            $video.css({
                'height': height,
                'marginLeft': marginLeftAdjust
            });
        }).resize();

        if (!frame) {
            frame = document.getElementById('stream');
        }

        frame.srcObject = stream;
        frame.onloadedmetadata = (e) => frame.play();

        if (!frame.fadeInInitial) {
            frame.fadeInInitial = 'processing...';
            $(frame).fadeOut(function () {
                $(frame).css('filter', 'opacity(100%)');
            }).delay().fadeIn('slow', function () {
                frame.fadeInInitial = 'complete!';
                if (DeveloperMode.getDevToolsDeveloperMode() &&
                    DeveloperMode.getDevToolsMode('append_frames')) console.log('%c➠ LOG: Frame(Stream) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
                interval = setInterval(frameInterval.bind(this, 'Stream'), 1000);
            });
        }
        i++;
    };

    function desktopCapturer_handleError(e) {
        if (DeveloperMode.getDevToolsDeveloperMode() &&
            DeveloperMode.getDevToolsMode('errors_system')) console.error(e);
    };
}

function IMGRENDER() {
    $('.layerFrame').append(`<img id="image" src="${urls[i][0]["url"]}" style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);" />`);

    if (!frame) {
        frame = document.getElementById('image');
    }

    if (!frame.fadeInInitial) {
        frame.fadeInInitial = 'processing...';
        $(frame).fadeOut(function () {
            $(frame).css('filter', 'opacity(100%)');
        }).delay().fadeIn('slow', function () {
            frame.fadeInInitial = 'complete!';
            if (DeveloperMode.getDevToolsDeveloperMode() &&
                DeveloperMode.getDevToolsMode('append_frames')) console.log('%c➠ LOG: Frame(Imagem) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
            interval = setInterval(frameInterval.bind(this, 'Imagem'), 1000);
        });
    }
    i++;
}

function VIDEORENDER() {
    $('.layerFrame').append(`<iframe id="video" src="${urls[i][0]["url"]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);"></iframe>`);

    if (!frame) {
        frame = document.getElementById('video');
    }

    if (!frame.fadeInInitial) {
        frame.fadeInInitial = 'processing...';
        $(frame).fadeOut(function () {
            $(frame).css('filter', 'opacity(100%)');
        }).delay().fadeIn('slow', function () {
            frame.fadeInInitial = 'complete!';
            if (DeveloperMode.getDevToolsDeveloperMode() &&
                DeveloperMode.getDevToolsMode('append_frames')) console.log('%c➠ LOG: Frame(Video) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
            interval = setInterval(frameInterval.bind(this, 'video'), 1000);
        });
    }
    i++;
}

function frameInterval(type) {
    if (
        frame &&
        frame.fadeInInitial === 'complete!'
    ) {
        let frametime = ConfigGlobal.FRAMETIME,
            frametimetype = ConfigGlobal.FRAMETIMETYPE,
            frametype = () => {
                return String(type).toLowerCase() === 'frame' ? 'Frame' : `Frame(${type})`;
            };

        if (
            frame.tick === undefined ||
            !frameIsPause() &&
            frame.tickReset
        ) {
            if (frame.tickReset) frame.tickReset = null;

            frame.tick = (() => {
                let date = new DATE();
                if (frametimetype === 1) {
                    date.addHours(frametime);
                } else if (frametimetype === 2) {
                    date.addMinutes(frametime);
                } else if (frametimetype === 3) {
                    date.addSeconds(frametime)
                }
                return date;
            })();

            frame.ticknow = () => {
                return new DATE();
            }
        }

        if (!frameIsPause() &&
            DeveloperMode.getDevToolsDeveloperMode() &&
            DeveloperMode.getDevToolsMode('tick_frames')) {
            console.log(
                `%c➠ LOG: Se ${frame.ticknow().getFullDate()} for igual a ${frame.tick.getFullDate()}, mude o slide ⌛ `,
                'color: #405cff; padding: 8px; font-size: 150%;'
            );
        }

        if (frameIsPause()) {
            if (!frame.tickReset) frame.tickReset = true;
            if (DeveloperMode.getDevToolsDeveloperMode() &&
                DeveloperMode.getDevToolsMode('pause_frames')) console.log(
                `%c➠ LOG: ⚠ O ${frametype()} está parado, assim que o mesmo estiver ativo. O contador será resetado, tendo o seu valor retornado a 0. ⚠`,
                'color: #e39b0b; padding: 8px; font-size: 150%;'
            );
        }

        if (frame.ticknow().compareOldDate(frame.tick)) {
            if (DeveloperMode.getDevToolsDeveloperMode() &&
                DeveloperMode.getDevToolsMode('remove_frames')) console.log(`%c➠ LOG: ${frametype()} Removido ✘`, 'color: #405cff; padding: 8px; font-size: 150%;');
            if (String(type).toLowerCase() === 'frame') {
                if (
                    !frame ||
                    frame.isLoading() ||
                    frame.isLoadingMainFrame() ||
                    frame.isWaitingForResponse() ||
                    frameIsPause() ||
                    frame.fadeInInitial === 'processing...' ||
                    fileProcess === 'write...' ||
                    fileProcess === 'reading...'
                ) return;
                removeFrame();
            } else if (
                String(type).toLowerCase() === 'stream' ||
                String(type).toLowerCase() === 'imagem' ||
                String(type).toLowerCase() === 'video'
            ) {
                if (!frame || frameIsPause() ||
                    frame.fadeInInitial === 'processing...' ||
                    fileProcess === 'write...' ||
                    fileProcess === 'reading...') return;
                removeFrame();
            }
        }
    }
};

/**
 * Memory Cache
 */
setInterval(async () => {
    /**
     * Verifica se existe novas mudanças.
     */
    if (
        menu.getMenuItemById('changelog_show').checked &&
        !controller.action('showchangelog') &&
        !controller.action('animate_init_layer_content') &&
        menuManager.isClear()
    ) {
        controller.changelog.initialize();
    }

    /**
     * Verifica se existe algo para ser exibido.
     */
    if (controller.frameEmpty() && !controller.action('addhomepage')) {
        controller.defineAction('addhomepage', true);
        $('.layerFrame').append(`
        <style>
            #layerHomePage {
                height: 100vh;
                opacity: 0;
            }

            #layerContentHomePage {
                height: 100vh;
            }
        </style>
        <div id="layerHomePage" class="bg-dark text-white col-12 overflow-auto">
            <div id="layerContentHomePage" class="row align-items-center justify-content-center">
                <div class="col-12">
                    <p class="text-uppercase text-muted text-center font-weight-bold" style="font-size: 5rem;">
                        WEBTABS
                    </p>
                    <p class="text-uppercase text-muted text-center font-weight-bold" style="font-size: 1.5rem;">
                        Abra o menu de ações com o atalho F9
                    </p>
                    <p class="text-uppercase text-muted text-center font-weight-bold" style="font-size: .8rem;">
                        Você pode adicionar urls, ou capturar a tela do monitor e exibir suas fotos.
                    </p>
                </div>
            </div>
        </div>
        <script>
            $(document).ready(() => {
                $('#layerHomePage').show("fast").delay(500).animate({
                    "opacity": 100
                }, 3600);
            });
        </script>
        `.trim());
    } else if (!frameIsPause() && !controller.frameEmpty() && controller.action('addhomepage')) {
        controller.defineAction('addhomepage', false);
        $('#layerHomePage').animate({
            "opacity": 0
        }, "fast").hide("fast");
    }

    /**
     * Verifica se existe comandos(Gerenciador de Frame) no servidor
     * à serem executados no programa.
     */
    if (menu.getMenuItemById('commands_controllerOnline_activated').checked &&
        !controller.action('control_managerFrame_initialize')) {
        controller.server.initialize('managerFrame');
    }

    /**
     * Caso não exista nada a ser exibido,
     * não passe daqui!
     */
    if (controller.frameEmpty()) return;

    /**
     * Verifica se existe comandos no servidor
     * à serem executados no programa.
     */
    if (frame &&
        frame.fadeInInitial === 'complete!' &&
        menu.getMenuItemById('commands_controllerOnline_activated').checked &&
        !controller.action('control_server_initialize')
    ) {
        controller.server.initialize('default');
    }

    /**
     * Verifica se o frame ainda não carregou,
     * durante o período de tempo estipulado.
     */
    if (!frame && !controller.frameEmpty()) {
        /**
         * Verifica a integridade dos dados
         * a serem carregados para o frame
         */
        if (!urls[i]) {
            loadDataURLs();
            return loadWebCookies();
        }

        /**
         * Limpa o cache do frame armazenado.
         */
        if (++tick[0] > tick[1]) {
            tick[0] = 0;
            /**
             * Limpa os cookies da pagina do Hard Disk (HD)
             */
            remote.getCurrentWindow().webContents.session.clearStorageData({
                    storages: 'cookies'
                })
                .then(() => {
                    if (typeof urls[i][2] === 'string') {
                        let cookie = {
                            i: 0,
                            l: cookies[urls[i][2]].length - 1,
                            values: cookies[urls[i][2]],
                            callers: {
                                listen: 0,
                                sucess: 0,
                                error: 0
                            }
                        };
                        for (; cookie.i < cookie.l; cookie.i++) {
                            /**
                             * Define os cookies da pagina
                             */
                            remote.getCurrentWindow().webContents.session.cookies.set({
                                    url: urls[i][0],
                                    name: cookie.values[cookie.i]['name'],
                                    value: cookie.values[cookie.i]['value'],
                                    domain: cookie.values[cookie.i]['domain'],
                                    path: cookie.values[cookie.i]['path'],
                                    secure: cookie.values[cookie.i]['secure'],
                                    httpOnly: cookie.values[cookie.i]['httpOnly'],
                                    expirationDate: cookie.values[cookie.i]['expirationDate']
                                })
                                .then(() => {
                                    cookie.callers.sucess++;
                                })
                                .catch((e) => {
                                    cookie.callers.error++;
                                })
                                .finally(() => {
                                    cookie.callers.listen++;
                                    if (cookie.callers.listen >= cookie.l) {
                                        /**
                                         * Se chamadas foram atendidas com exito!
                                         */
                                        if (cookie.callers.sucess > 0) {
                                            /**
                                             * Escreve os cookies da pagina no Hard Disk (HD)
                                             */
                                            remote.getCurrentWindow().webContents.session.cookies.flushStore()
                                                .then(() => {
                                                    return framereload();
                                                })
                                                .catch((e) => {
                                                    if (DeveloperMode.getDevToolsDeveloperMode() &&
                                                        DeveloperMode.getDevToolsMode('errors_system')) console.error(e);
                                                });
                                        }
                                        /**
                                         * Se não existe chamadas atendidas com exito!
                                         */
                                        else {
                                            /**
                                             * Limpa o cookie da pagina no sistema. 
                                             */
                                            saveDataURLs();
                                            return framereload();
                                        }
                                    }
                                });
                        }
                    } else {
                        return framereload();
                    }
                }).catch((e) => {
                    if (DeveloperMode.getDevToolsDeveloperMode() &&
                        DeveloperMode.getDevToolsMode('errors_system')) console.error(e);
                });
        }
    }

    /**
     * Frame Waiting for remove
     */
    /**
     * D-Guard
     */
    if ($("#button_extension_dguard_remove_frame").html() === 'Excluindo...') {
        $('#layerExtension-DGuard').delay("slow").hide("fast");
        deleteFrame('dguard');
        return;
    }

    /**
     * Verifica se o menu de gerenciamento de conteúdo
     * está sendo utilizado
     */
    if (menuManager.isMenu('contentsManager')) return;

    if (
        (!frame && !ProcessInterval && fileProcess === 'done')
    ) {
        framereload();
        if (i >= urls.length) i = 0;
        if (typeof urls[i][0] === 'string') {
            ProcessInterval = !ProcessInterval ? 'processing...' : ProcessInterval;
            /**
             * Exceções
             */
            switch (String(urls[i][2]).toLowerCase()) {
                /**
                 * D-Guard
                 */
                case 'dguard':
                    let {
                        username, password, cam, layout_cam
                    } = JSON.parse(fs.readFileSync(path.localPath('extensions/storage/dguard.json'))) || {},
                        __file = LZString.decompressFromBase64(fs.readFileSync(path.localPath('extensions/scripts/dguard.js')).toString()) || '';
                    /**
                     * Erro com a configuração do layout
                     */
                    if (
                        (layout_cam < 1 || layout_cam > 3)
                    ) {
                        layout_cam = 3;
                        await fs.writeFileSync(path.localPath('extensions/storage/dguard.json'), Buffer.from(JSON.stringify({
                            username,
                            password,
                            layout_cam,
                            cam
                        }), 'utf-8'), {
                            flag: 'w+'
                        });
                    }
                    /**
                     * Erro com a seleção de cameras
                     */
                    if (cam < 0) {
                        cam = 0;
                        await fs.writeFileSync(path.localPath('extensions/storage/dguard.json'), Buffer.from(JSON.stringify({
                            username,
                            password,
                            layout_cam,
                            cam
                        }), 'utf-8'), {
                            flag: 'w+'
                        });
                    }
                    /**
                     * Erro com nome de usuário ou senha
                     */
                    if (
                        (typeof username != 'string' || typeof password != 'string') ||
                        (username.length <= 0 || password.length <= 0)
                    ) {
                        if ($('#layerExtension-DGuard').is(':hidden')) {
                            $('#layerExtension-DGuard').show("fast");
                            ALERT.info('', `Verifique seu nome/senha de usuario do D-Guard.`);
                        }
                        return ProcessInterval = null;
                    }
                    /**
                     * Verifica se a janela de configuração está aberta
                     */
                    if ($('#layerExtension-DGuard').is(":visible")) {
                        return ProcessInterval = null;
                    }
                    __file = __file.replace('__NAME__VALUE__', username);
                    __file = __file.replace('__PASS__VALUE__', password);
                    __file = __file.replace('__CAM__VALUE__', cam);
                    __file = __file.replace('__LAYOUT_CAM__VALUE__', layout_cam);
                    return render(['dguard', __file]);
            }
            /**
             * Limpa os cookies da pagina do Hard Disk (HD)
             */
            remote.getCurrentWindow().webContents.session.clearStorageData({
                    storages: 'cookies'
                })
                .then(() => {
                    if (typeof urls[i][2] === 'string') {
                        let cookie = {
                            i: 0,
                            l: cookies[urls[i][2]].length,
                            values: cookies[urls[i][2]],
                            callers: {
                                listen: 0,
                                sucess: 0,
                                error: 0
                            }
                        };
                        for (; cookie.i < cookie.l; cookie.i++) {
                            /**
                             * Define os cookies da pagina
                             */
                            if (!cookie.values[cookie.i]) continue;
                            remote.getCurrentWindow().webContents.session.cookies.set({
                                    url: urls[i][0],
                                    name: cookie.values[cookie.i]['name'],
                                    value: cookie.values[cookie.i]['value'],
                                    domain: cookie.values[cookie.i]['domain'],
                                    path: cookie.values[cookie.i]['path'],
                                    secure: cookie.values[cookie.i]['secure'],
                                    httpOnly: cookie.values[cookie.i]['httpOnly'],
                                    expirationDate: cookie.values[cookie.i]['expirationDate']
                                })
                                .then(() => {
                                    cookie.callers.sucess++;
                                })
                                .catch((e) => {
                                    cookie.callers.error++;
                                })
                                .finally(() => {
                                    cookie.callers.listen++;
                                    if (cookie.callers.listen >= cookie.l) {
                                        /**
                                         * Se chamadas foram atendidas com exito!
                                         */
                                        if (cookie.callers.sucess > 0) {
                                            /**
                                             * Escreve os cookies da pagina no Hard Disk (HD)
                                             */
                                            remote.getCurrentWindow().webContents.session.cookies.flushStore()
                                                .then(() => {
                                                    return render();
                                                })
                                                .catch((e) => {
                                                    if (DeveloperMode.getDevToolsDeveloperMode() &&
                                                        DeveloperMode.getDevToolsMode('errors_system')) console.error(e);
                                                });
                                        }
                                        /**
                                         * Se não existe chamadas atendidas com exito!
                                         */
                                        else {
                                            /**
                                             * Limpa o cookie da pagina no sistema. 
                                             */
                                            ProcessInterval = null;
                                            return saveDataURLs();
                                        }
                                    }
                                });
                        }
                    } else {
                        return render();
                    }
                }).catch((e) => {
                    if (DeveloperMode.getDevToolsDeveloperMode() &&
                        DeveloperMode.getDevToolsMode('errors_system')) console.error(e);
                });

            /**
             * Processo de renderização do frame
             */
            function render(exception) {
                $('.layerFrame').append(`<webview id="frame" src="${urls[i++][0]}" style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);"></webview>`);

                if (!frame) {
                    frame = document.getElementById('frame');
                }

                frame.listener = function () {
                    if (DeveloperMode.getDevToolsDeveloperMode() &&
                        DeveloperMode.getDevToolsMode('append_frames')) console.log('%c➠ LOG: Frame Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
                    if (!frame.fadeInInitial) {
                        frame.fadeInInitial = 'processing...';
                        $(frame).fadeOut(function () {
                            $(frame).css('filter', 'opacity(100%)');
                            /**
                             * Extensions
                             */
                            if (exception instanceof Array) {
                                /**
                                 * D-Guard
                                 */
                                if (exception[0] === 'dguard') {
                                    frame.executeJavaScript(exception[1]);
                                    if (DeveloperMode.getStatus()) frame.openDevTools();
                                    frame.executeJavaScript(`
                                        new Promise((resolve, reject) => {
                                            let interval = setInterval(()=> {
                                                if (document.webtabs) {
                                                    let contents = document.getElementsByTagName('md-content')[1].getElementsByClassName('md-virtual-repeat-container md-orient-vertical ng-scope layout-align-center-stretch layout-row flex')[0].getElementsByClassName('md-virtual-repeat-scroller')[0].getElementsByClassName('md-virtual-repeat-offsetter')[0].children,
                                                    i = 0,
                                                    l = contents.length,
                                                    menus = [];
                                                    for (; i < l; i++) {
                                                        menus.push(contents[i].getElementsByTagName('span')[0].innerText);
                                                    }
                                                    resolve(menus);
                                                    clearInterval(interval);
                                                }
                                            }, 1000);
                                        });
                                    `).then(result => {
                                        let menus = result;
                                        if (menus instanceof Array) {
                                            let items = [];
                                            menus.map((label, id) => {
                                                items.push({
                                                    label: label,
                                                    id: `cam_${id}`,
                                                    type: 'radio',
                                                    checked: false
                                                });
                                            });
                                            ipcRenderer.send('extensions_dguard_menu_update', items);
                                        }
                                    });
                                }
                            }
                        }).delay().fadeIn('slow', function () {
                            frame.fadeInInitial = 'complete!';
                            ProcessInterval = null;
                            /**
                             * Extensions
                             */
                            if (exception instanceof Array) {
                                /**
                                 * D-Guard
                                 */
                                if (exception[0] === 'dguard') {
                                    let auth = setInterval(() => {
                                        frame.executeJavaScript(`
                                    new Promise((resolve, reject) => {
                                        return resolve($('#reset').length);
                                    });
                                `).then(result => {
                                            if (result > 0) {
                                                if ($('#layerExtension-DGuard').is(':hidden')) {
                                                    $('#layerExtension-DGuard').show("fast");
                                                    ALERT.info('', `Verifique seu nome/senha de usuário do D-Guard.`);
                                                } else {
                                                    flushFrame();
                                                    clearInterval(auth);
                                                }
                                            } else {
                                                clearInterval(auth);
                                            }
                                        });
                                    }, 1000);
                                }
                            }

                            /**
                             * Coloca os videos do Youtube em tela cheia
                             */
                            if (String(urls[i - 1][0]).indexOf('youtube.com') != -1) {
                                frame.executeJavaScript(`
                                new Promise((resolve, reject) => {
                                    let btn = document.getElementsByClassName('ytp-fullscreen-button');
                                    if (typeof btn[0] === 'object') {
                                        btn[0].click();
                                        return resolve();
                                    } else {
                                        return resolve('recused');
                                    }
                                });
                            `, true).then(result => {
                                    if (result === 'recused') {
                                        if (DeveloperMode.getDevToolsDeveloperMode() &&
                                            DeveloperMode.getDevToolsMode('erros_system')) console.log('%c➠ Youtube(LOG): Não foi possível colocar o vídeo em fullscreen automaticamente. ✗', 'color: #ff3624; padding: 8px; font-size: 150%;');
                                    }
                                });
                            }
                        });
                    }
                    frame.setZoomLevel(urls[i - 1][1]);
                    interval = setInterval(frameInterval.bind(this, 'Frame'), 1000);
                }
                frame.addEventListener('did-finish-load', frame.listener);
            }
        } else if (typeof urls[i][0] === 'object' && urls[i][0]['type_url'] === 'stream') {
            DESKTOPCAPTURER();
        } else if (typeof urls[i][0] === 'object' && urls[i][0]['type_url'] === 'image') {
            IMGRENDER();
        } else if (typeof urls[i][0] === 'object' && urls[i][0]['type_url'] === 'video') {
            VIDEORENDER();
        }
    }
}, 1000);

/**
 * Events
 */
ipcRenderer
    .on('render_framePause', () => {
        if (controller.frameEmpty()) return;
        if (!frameIsPause()) {
            controller.defineAction('frameIsPause', true);
            framePause();
        }
    })
    .on('render_frameResume', () => {
        if (controller.frameEmpty()) return;
        if (frameIsPause()) {
            controller.defineAction('frameIsPause', false);
            frameResume();
        }
    })
    .on('render_resetZoom', () => {
        if (controller.frameEmpty()) return;
        if (frame) {
            if (!frame.removeProcess && typeof frame.setZoomLevel === 'function') {
                frame.setZoomLevel(0);
            }
        }
    })
    .on('render_increaseZoom', () => {
        if (controller.frameEmpty()) return;
        if (frame) {
            if (!frame.removeProcess && typeof frame.getZoomLevel === 'function') {
                let zoom = frame.getZoomLevel(),
                    value = zoom + (frame.getZoomFactor() / 2);
                if (Math.floor(value) < 12)
                    frame.setZoomLevel(value);
            }
        }
    })
    .on('render_reduceZoom', () => {
        if (controller.frameEmpty()) return;
        if (frame) {
            if (!frame.removeProcess && typeof frame.getZoomLevel === 'function') {
                let zoom = frame.getZoomLevel(),
                    value = zoom - (frame.getZoomFactor() / 2);
                if (Math.floor(value) > -8)
                    frame.setZoomLevel(value);
            }
        }
    })
    .on('render_next', () => {
        if (controller.frameEmpty() || controller.action('frame_add_url_process')) return;
        if (frame && frame.fadeInInitial === 'complete!' && fileProcess === 'done') {
            removeFrame();
        }
    })
    .on('render_return', () => {
        if (controller.frameEmpty() || controller.action('frame_add_url_process')) return;
        if (frame && frame.fadeInInitial === 'complete!' && fileProcess === 'done') {
            returnFrame();
        }
    })
    .on('add_url', () => {
        if (urls) {
            while (controller.action('frame_add_url_process') || frame && frame.fadeInInitial === 'processing...' || frame && frame.removeProcess) return;
            loadDataURLs();
        }
    })
    .on('frame_time_refresh', () => {
        if (!frame.tickReset) frame.tickReset = true;
        createConfigGlobal();
    })
    .on('extension_dguard', (event, cam) => {
        let interval = setInterval(new Promise(async (resolve, reject) => {
                if (typeof cam === 'number') {
                    frame.executeJavaScript(`document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')[0].click();`);
                    frame.executeJavaScript(`document.getElementsByClassName('md-no-style md-button md-dguardlight-theme md-ink-ripple flex')[${cam}].click();`);
                    var __cookies = JSON.parse(fs.readFileSync(path.localPath('extensions/storage/dguard.json'))) || {};
                    __cookies['cam'] = cam;
                } else if (typeof cam === 'string') {
                    if (cam === 'layout_1') {
                        cam = 1;
                    } else if (cam === 'layout_2') {
                        cam = 2;
                    } else if (cam === 'layout_3') {
                        cam = 3;
                    }
                    frame.executeJavaScript(`document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')[${cam}].click();`);
                    var __cookies = JSON.parse(fs.readFileSync(path.localPath('extensions/storage/dguard.json'))) || {};
                    __cookies['layout_cam'] = cam;
                }
                await fs.writeFileSync(path.localPath('extensions/storage/dguard.json'), Buffer.from(JSON.stringify(__cookies), 'utf-8'), {
                    flag: 'w+'
                });
                resolve();
            })
            .then(() => {
                clearInterval(interval);
            }), 1000);
    })
    .on('window_frame_reload', async () => {
        let file = path.localPath('storage/framereload.json');
        if (!path.localPathExists('storage/framereload.json')) path.localPathCreate('storage/framereload.json');
        await fs.writeFileSync(file, Buffer.from(JSON.stringify({
            "cache": i - 1
        }), 'utf-8'), {
            flag: 'w+'
        });
        remote.getCurrentWindow().webContents.reload();
    })
    .on('window_frame_show_info_system', () => {
        ALERT.info('WEBTABS', `Versão atual: ${controller.versionSystem}`);
    })
    .on('changelog_reset_registry', () => {
        controller.changelog.resetShowChangelog();
    })