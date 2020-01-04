/**
 * Import
 */
const [
    {
        remote,
        ipcRenderer,
        desktopCapturer,
        session
    },
    path,
    fs
] = [
        require('electron'),
        require('../import/localPath'),
        require('fs')
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
        null
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
    if (!path.localPathExists('data/configs/global.json')) path.localPathCreate('data/configs/global.json');
    if (fs.existsSync(path.localPath('data/configs/global.json'))) {
        ConfigGlobal = JSON.parse(fs.readFileSync(path.localPath('data/configs/global.json'), 'utf8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "TITLE": "GRUPO MAVE 2019",
            "SLOGAN": "Você e seu Patrimônio em boas mãos!",
            "VERSION": "v3.0.0-rebuild",
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2
        }
        fs.writeFileSync(path.localPath('data/configs/global.json'), JSON.stringify(ConfigGlobal, null, 2), 'utf8');
    }
};

function createDataURLs() {
    if (!path.localPathExists('data/storage/urls.json')) path.localPathCreate('data/storage/urls.json');
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

function createWebCookies() {
    if (!path.localPathExists('data/storage/webcookies.json')) path.localPathCreate('data/storage/webcookies.json');
    if (fs.existsSync(path.localPath('data/storage/webcookies.json'))) {
        web_cookies = JSON.parse(fs.readFileSync(path.localPath('data/storage/webcookies.json'), 'utf8')) || { 'size': 0 };
    } else {
        web_cookies = { 'size': 0 };
        fs.writeFileSync(path.localPath('data/storage/webcookies.json'), JSON.stringify(web_cookies, null, 2), 'utf8');
    }
};

/**
 * Data Urls
 */
function saveDataURLs() {
    let file = path.localPath('data/storage/urls.json');
    if (path.localPathExists('data/storage/urls.json')) {
        fileProcess = 'write...';
        fs.writeFile(file, JSON.stringify(urls, null, 2), 'utf8', () => {
            fileProcess = 'done';
            saveWebCookies();
        });
    }
};

function loadDataURLs() {
    let file = path.localPath('data/storage/urls.json');
    if (path.localPathExists('data/storage/urls.json')) {
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

/**
 * Webcookies
 */
function saveWebCookies() {
    let file = path.localPath('data/storage/webcookies.json');
    if (path.localPathExists('data/storage/webcookies.json')) {
        fileProcess = 'write...';
        fs.writeFile(file, JSON.stringify(cookies, null, 2), 'utf8', () => {
            fileProcess = 'done';
        });
    }
};

function loadWebCookies() {
    let file = path.localPath('data/storage/webcookies.json');
    if (path.localPathExists('data/storage/webcookies.json')) {
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

/**
 * Frame Reload
 */
function framereload() {
    let file = path.localPath('data/storage/framereload.json');
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
                        console.log(error);
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
                        console.log(error);
                    });
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                finish(false);
            }
            function finish(listener) {
                i = i - 2;
                saveDataURLs();
                clearInterval(interval), interval = null;
                if (listener) frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
            }
        });
    }
};

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
                console.log('%c➠ LOG: Frame(Stream) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
                interval = setInterval(frameInterval.bind(this, 'Stream'), 1000);
            });
        }
        i++;
    };

    function desktopCapturer_handleError(e) {
        console.error(e);
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
            console.log('%c➠ LOG: Frame(Imagem) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
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
            console.log('%c➠ LOG: Frame(Video) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
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
                let date = new Date();
                if (frametimetype === 1) {
                    date.setHours(date.getHours() + frametime);
                } else if (frametimetype === 2) {
                    date.setMinutes(date.getMinutes() + frametime);

                } else if (frametimetype === 3) {
                    date.setSeconds(date.getSeconds() + frametime);
                }
                let days = [
                    'Domingo',
                    'Segunda',
                    'Terça',
                    'Quarta',
                    'Quinta',
                    'Sexta',
                    'Sabado'
                ],
                    months = [
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro'
                    ]
                return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            })();
            frame.ticknow = () => {
                let date = new Date();
                let days = [
                    'Domingo',
                    'Segunda',
                    'Terça',
                    'Quarta',
                    'Quinta',
                    'Sexta',
                    'Sabado'
                ],
                    months = [
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro'
                    ]
                return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            }
        }
        if (menu.getMenuItemById('PAUSE').checked) {
            if (!frame.tickReset) frame.tickReset = true;
            console.log(
                `%c➠ LOG: ⚠ O ${frametype()} está parado, assim que o mesmo estiver ativo. O contador será resetado, tendo o seu valor retornado a 0. ⚠`,
                'color: #e39b0b; padding: 8px; font-size: 150%;'
            );
        }
        console.log(
            `%c➠ LOG: Se ${frame.ticknow()} for igual a ${frame.tick}, mude o slide ⌛ `,
            'color: #405cff; padding: 8px; font-size: 150%;'
        );
        if (frame.tick === frame.ticknow()) {
            console.log(`%c➠ LOG: ${frametype()} Removido ✘`, 'color: #405cff; padding: 8px; font-size: 150%;');
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
    if (
        !frame &&
        !ProcessInterval &&
        fileProcess === 'done'
    ) {
        framereload();
        if (i >= urls.length) i = 0;
        if (typeof urls[i][0] === 'string') {
            ProcessInterval = 'processing...';
            /**
             * Exceções
             */
            switch (String(urls[i][2]).toLowerCase()) {
                /**
                 * D-Guard
                 */
                case 'dguard':
                    let __cookies = JSON.parse(fs.readFileSync(path.localPath('data/extensions/storage/dguard.json'))) || {},
                        __file = fs.readFileSync(path.localPath('data/extensions/scripts/dguard.js')).toString();
                    __file = __file.replace('__NAME__VALUE__', __cookies['username']);
                    __file = __file.replace('__PASS__VALUE__', __cookies['password']);
                    __file = __file.replace('__CAM__VALUE__', __cookies['cam']);
                    __file = __file.replace('__LAYOUT_CAM__VALUE__', __cookies['layout_cam']);
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
                                        console.log(`HISTORICO DE CHAMADAS:`);
                                        console.log(`Atendidas: ${cookie.callers.listen}`);
                                        console.log(`Sucesso: ${cookie.callers.sucess}`);
                                        console.log(`Erros: ${cookie.callers.error}`);
                                        if (cookie.callers.sucess > 0) {
                                            /**
                                             * Escreve os cookies da pagina no Hard Disk (HD)
                                             */
                                            remote.getCurrentWindow().webContents.session.cookies.flushStore()
                                                .then(() => {
                                                    render();
                                                })
                                                .catch((e) => {
                                                    console.error(e);
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
                                            saveDataURLs();
                                        }
                                    }
                                });
                        }
                    } else {
                        render();
                    }
                }).catch((e) => {
                    console.error(e);
                });

            function render(exception) {
                $('.layerFrame').append(`<webview id="frame" src="${urls[i++][0]}" style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);"></webview>`);

                if (!frame) {
                    frame = document.getElementById('frame');
                }

                frame.listener = function () {
                    console.log('%c➠ LOG: Frame Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
                    if (!frame.fadeInInitial) {
                        frame.fadeInInitial = 'processing...';
                        $(frame).fadeOut(function () {
                            $(frame).css('filter', 'opacity(100%)');
                            if (exception instanceof Array) {
                                if (exception[0] === 'dguard') {
                                    frame.executeJavaScript(exception[1]);
                                }
                            }
                        }).delay().fadeIn('slow', function () {
                            frame.fadeInInitial = 'complete!';
                            ProcessInterval = null;
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
        let interval = setInterval(new Promise((resolve, rejec) => {
            if (typeof cam === 'number') {
                frame.executeJavaScript(`document.getElementsByClassName('md-no-style md-button md-dguardlight-theme md-ink-ripple flex')[${cam}].click();`);
                frame.executeJavaScript(`setTimeout(function () {document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')[0].click();}, 500);`);
                var __cookies = JSON.parse(fs.readFileSync(path.localPath('data/extensions/storage/dguard.json'))) || {};
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
                var __cookies = JSON.parse(fs.readFileSync(path.localPath('data/extensions/storage/dguard.json'))) || {};
                __cookies['layout_cam'] = cam;
            }
            fs.writeFileSync(path.localPath('data/extensions/storage/dguard.json'), JSON.stringify(__cookies, null, 2));
            resolve();
        })
            .then(() => {
                clearInterval(interval);
            }), 1000);
    })
    .on('window_frame_reload', () => {
        let file = path.localPath('data/storage/framereload.json');
        if (!path.localPathExists('data/storage/framereload.json')) path.localPathCreate('data/storage/framereload.json');
        fs.writeFileSync(file, JSON.stringify({
            "cache": i - 1
        }, null, 2), 'utf8');
        remote.getCurrentWindow().webContents.reload();
    });