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
    fs,
    isDev,
    ALERT,
    DATE,
    LZString
] = [
        require('electron'),
        require('../import/localPath'),
        require('fs'),
        require('../import/isDev'),
        require('../import/alert'),
        require('../classes/tick'),
        require('../import/LZString')
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
    ProcessInterval
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
function createConfigGlobal() {
    if (!path.localPathExists('configs/global.json')) path.localPathCreate('configs/global.json');
    if (fs.existsSync(path.localPath('configs/global.json'))) {
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('configs/global.json'), 'utf8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "TITLE": "GRUPO MAVE 2019",
            "SLOGAN": "Você e seu Patrimônio em boas mãos!",
            "VERSION": "v4.10.25-beta.5",
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2
        }
        fs.writeFileSync(path.localPath('configs/global.json'), JSON.stringify(ConfigGlobal, null, 2), 'utf8');
    }
};

function createDataURLs() {
    if (!path.localPathExists('storage/urls.json')) path.localPathCreate('storage/urls.json');
    if (fs.existsSync(path.localPath('storage/urls.json'))) {
        data_urls = JSON.parse(fs.readFileSync(path.localPath('storage/urls.json'), 'utf8')) || [
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
        fs.writeFileSync(path.localPath('storage/urls.json'), JSON.stringify(data_urls, null, 2), 'utf8');
    }
};

function createWebCookies() {
    if (!path.localPathExists('storage/webcookies.json')) path.localPathCreate('storage/webcookies.json');
    if (fs.existsSync(path.localPath('storage/webcookies.json'))) {
        web_cookies = JSON.parse(fs.readFileSync(path.localPath('storage/webcookies.json'), 'utf8')) || { 'size': 0 };
    } else {
        web_cookies = { 'size': 0 };
        fs.writeFileSync(path.localPath('storage/webcookies.json'), JSON.stringify(web_cookies, null, 2), 'utf8');
    }
};

/**
 * Data Urls
 */
function saveDataURLs() {
    let file = path.localPath('storage/urls.json');
    if (path.localPathExists('storage/urls.json')) {
        fileProcess = 'write...';
        fs.writeFile(file, JSON.stringify(urls, null, 2), 'utf8', () => {
            fileProcess = 'done';
            saveWebCookies();
        });
    }
};

function loadDataURLs() {
    let file = path.localPath('storage/urls.json');
    if (path.localPathExists('storage/urls.json')) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, {
            encoding: 'utf8'
        }));
        if (data instanceof Array === true) {
            fileProcess = 'done';
            urls = data;
            loadWebCookies();
        }
    }
};

function removeDataURLs(i) {
    let file = path.localPath('storage/urls.json');
    if (path.localPathExists('storage/urls.json')) {
        fileProcess = 'write...';
        if (urls[i] instanceof Array) {
            let cookie = urls[i][2];
            urls.splice(i, 1);
            fs.writeFile(file, JSON.stringify(urls, null, 2), 'utf8', () => {
                fileProcess = 'done';
                removeWebCookies(cookie);
            });
        }
    }
};

/**
 * Webcookies
 */
function saveWebCookies() {
    let file = path.localPath('storage/webcookies.json');
    if (path.localPathExists('storage/webcookies.json')) {
        fileProcess = 'write...';
        fs.writeFile(file, JSON.stringify(cookies, null, 2), 'utf8', () => {
            fileProcess = 'done';
        });
    }
};

function loadWebCookies() {
    let file = path.localPath('storage/webcookies.json');
    if (path.localPathExists('storage/webcookies.json')) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, {
            encoding: 'utf8'
        }));
        if (data instanceof Object === true) {
            fileProcess = 'done';
            cookies = data;
        }
    }
};

function removeWebCookies(cookie) {
    let file = path.localPath('storage/webcookies.json');
    if (path.localPathExists('storage/webcookies.json')) {
        fileProcess = 'write...';
        if (cookies[cookie] instanceof Array) delete cookies[cookie];
        fs.writeFile(file, JSON.stringify(cookies, null, 2), 'utf8', () => {
            fileProcess = 'done';
        });
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
                        cookies[urls[i - 1][2]] = data;
                        saveDataURLs();
                        clearInterval(interval), interval = null;
                        frame.removeEventListener('did-finish-load', frame.listener);
                        frame.remove();
                        frame = null;
                    }).catch((error) => {
                        if (isDev()) console.log(error);
                    });
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                finish(false);
            }
            function finish(listener) {
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
            }
        });
    }
};

function returnFrame() {
    if (urls.length <= 0) return;
    if (frame && i > 1) {
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
                        cookies[urls[i - 1][2]] = data;
                        finish(true);
                    }).catch((error) => {
                        if (isDev()) console.log(error);
                    });
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                finish(false);
            }
            function finish(listener) {
                i = i - 2 < 0 ? 0 : i - 2;
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
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
                        cookies[urls[__i][2]] = data;
                        finish(true);
                    }).catch((error) => {
                        if (isDev()) console.log(error);
                    });
            } else if (
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'stream' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'image' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'video'
            ) {
                finish(false);
            }
            function finish(listener) {
                i = __i;
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
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
                i = __i;
                clearInterval(interval), interval = null;
                if (frame.listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
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
                        cookies[urls[__i][2]] = data;
                        finish(true);
                    }).catch((error) => {
                        if (isDev()) console.log(error);
                    });
            } else if (
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'stream' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'image' ||
                typeof urls[__i][0] === 'object' && urls[__i][0]["type_url"] === 'video'
            ) {
                finish(false);
            }
            function finish(listener) {
                i = __i;
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
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
        $('.layerFrame').append(`<video id="stream" style="z-index: 1; display:inline-flexbox; width: 100vw; filter:opacity(0%);" />`);

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
                if (isDev()) console.log('%c➠ LOG: Frame(Stream) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
                interval = setInterval(frameInterval.bind(this, 'Stream'), 1000);
            });
        }
        i++;
    };

    function desktopCapturer_handleError(e) {
        if (isDev()) console.error(e);
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
            if (isDev()) console.log('%c➠ LOG: Frame(Imagem) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
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
            if (isDev()) console.log('%c➠ LOG: Frame(Video) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
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
            !menu.getMenuItemById('PAUSE').checked &&
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
        if (menu.getMenuItemById('PAUSE').checked) {
            if (!frame.tickReset) frame.tickReset = true;
            if (isDev()) console.log(
                `%c➠ LOG: ⚠ O ${frametype()} está parado, assim que o mesmo estiver ativo. O contador será resetado, tendo o seu valor retornado a 0. ⚠`,
                'color: #e39b0b; padding: 8px; font-size: 150%;'
            );
        }
        if (isDev()) console.log(
            `%c➠ LOG: Se ${frame.ticknow().getFullDate()} for igual a ${frame.tick.getFullDate()}, mude o slide ⌛ `,
            'color: #405cff; padding: 8px; font-size: 150%;'
        );
        if (frame.ticknow().compareOldDate(frame.tick)) {
            if (isDev()) console.log(`%c➠ LOG: ${frametype()} Removido ✘`, 'color: #405cff; padding: 8px; font-size: 150%;');
            if (String(type).toLowerCase() === 'frame') {
                if (
                    !frame ||
                    frame.isLoading() ||
                    frame.isLoadingMainFrame() ||
                    frame.isWaitingForResponse() ||
                    menu.getMenuItemById('PAUSE').checked ||
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
                if (!frame || menu.getMenuItemById('PAUSE').checked ||
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
setInterval(() => {
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
                    let { username, password, cam, layout_cam } = JSON.parse(fs.readFileSync(path.localPath('extensions/storage/dguard.json'))) || {},
                        __file = LZString.decompressFromBase64(fs.readFileSync(path.localPath('extensions/scripts/dguard.js')).toString()) || '';
                    /**
                     * Erro com a configuração do layout
                     */
                    if (
                        (layout_cam < 1 || layout_cam > 3)
                    ) {
                        layout_cam = 3;
                        fs.writeFileSync(path.localPath('extensions/storage/dguard.json'),
                            JSON.stringify({ username, password, layout_cam, cam }, null, 2));
                    }
                    /**
                     * Erro com a seleção de cameras
                     */
                    if (cam < 0) {
                        cam = 0;
                        fs.writeFileSync(path.localPath('extensions/storage/dguard.json'),
                            JSON.stringify({ username, password, layout_cam, cam }, null, 2));
                    }
                    /**
                     * Erro com nome de usuario ou senha
                     */
                    if (
                        (typeof username != 'string' || typeof password != 'string') ||
                        (username.length <= 0 || password.length <= 0)
                    ) {
                        if ($('#layerExtension-DGuard').is(':hidden')) {
                            $('#layerExtension-DGuard').show("fast");
                            ALERT.info(`Verifique seu nome/senha de usuario do D-Guard.`);
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
                                                    return render();
                                                })
                                                .catch((e) => {
                                                    if (isDev()) console.error(e);
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
                    if (isDev()) console.error(e);
                });

            function render(exception) {
                $('.layerFrame').append(`<webview id="frame" src="${urls[i++][0]}" style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);"></webview>`);

                if (!frame) {
                    frame = document.getElementById('frame');
                }

                frame.listener = function () {
                    if (isDev()) console.log('%c➠ LOG: Frame Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
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
                                    if (isDev()) frame.openDevTools();
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
                                                    ALERT.info(`Verifique seu nome/senha de usuario do D-Guard.`);
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
    .on('render_resetZoom', () => {
        if (frame) {
            if (!frame.removeProcess && typeof frame.setZoomLevel === 'function') {
                frame.setZoomLevel(0);
            }
        }
    })
    .on('render_increaseZoom', () => {
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
        if (frame && fileProcess === 'done') {
            removeFrame();
        }
    })
    .on('render_return', () => {
        if (frame && fileProcess === 'done') {
            returnFrame();
        }
    })
    .on('add_url', () => {
        if (urls) {
            while (frame && frame.fadeInInitial === 'processing...' ||
                frame && frame.removeProcess) return;
            loadDataURLs();
        }
    })
    .on('frame_time_refresh', () => {
        if (!frame.tickReset) frame.tickReset = true;
        createConfigGlobal();
    })
    .on('extension_dguard', (event, cam) => {
        let interval = setInterval(new Promise((resolve, reject) => {
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
            fs.writeFileSync(path.localPath('extensions/storage/dguard.json'), JSON.stringify(__cookies, null, 2));
            resolve();
        })
            .then(() => {
                clearInterval(interval);
            }), 1000);
    })
    .on('window_frame_reload', () => {
        let file = path.localPath('storage/framereload.json');
        if (!path.localPathExists('storage/framereload.json')) path.localPathCreate('storage/framereload.json');
        fs.writeFileSync(file, JSON.stringify({
            "cache": i - 1
        }, null, 2), 'utf8');
        remote.getCurrentWindow().webContents.reload();
    });