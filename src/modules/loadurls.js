import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';
import { localPath, localPathExists, localPathCreate } from './localPath';

let ConfigGlobal;
loadConfigGlobal();
function loadConfigGlobal() {
    if (!localPathExists(localPath('src/config/data/global.json'))) localPathCreate(localPath('src/config/data/global.json'));
    if (Electron.remote.require('fs').existsSync(localPath('src/config/data/global.json'))) {
        ConfigGlobal = JSON.parse(Electron.remote.require('fs').readFileSync(localPath('src/config/data/global.json'), 'utf8')) || [];
    } else {
        ConfigGlobal = {
            "APPNAME": "WEBTABS",
            "TITLE": "GRUPO MAVE 2019",
            "SLOGAN": "Você e seu Patrimônio em boas mãos!",
            "VERSION": "v3.0.0-rebuild",
            "FRAMETIME": 2,
            "FRAMETIMETYPE": 2
        }
        Electron.remote.require('fs').writeFileSync(localPath('src/config/data/global.json'), JSON.stringify(ConfigGlobal, null, 2), 'utf8');
    }
};

let data_urls;
if (!localPathExists(localPath('src/config/data/urls.json'))) localPathCreate(localPath('src/config/data/urls.json'));
if (Electron.remote.require('fs').existsSync(localPath('src/config/data/urls.json'))) {
    data_urls = JSON.parse(Electron.remote.require('fs').readFileSync(localPath('src/config/data/urls.json'), 'utf8')) || [
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
    Electron.remote.require('fs').writeFileSync(localPath('src/config/data/urls.json'), JSON.stringify(data_urls, null, 2), 'utf8');
}

/**
 * VARIABLES SYSTEM
 */
const { Menu } = Electron.remote.require('electron');
let menu = Menu.getApplicationMenu(),
    frame,
    interval,
    fileProcess;

/**
 * VARIABLES RENDER
 */
let [
    urls,
    i
] = [
        data_urls,
        0
    ]

load();

/**
 * FILE
 */
function save() {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/urls.json');
    if (localPathExists(file)) {
        fileProcess = 'write...';
        fs.writeFile(file, JSON.stringify(urls, null, 2), 'utf8', () => {
            fileProcess = 'done';
        });
    }
};


function load() {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/urls.json');
    if (localPathExists(file)) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
        if (data instanceof Array === true) {
            fileProcess = 'done';
            urls = data;
        }
    }
};

function remove_url(index) {
    let fs = Electron.remote.require('fs'),
        file = localPath('src/config/data/urls.json');
    if (localPathExists(file)) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
        if (data instanceof Array === true) {
            fileProcess = 'done';
            data.splice(index, 1);
            urls = data;
            save();
        }
    }

};

/**
 * PROCESS RENDER
 */

//-------------------------------------------------
//  Events
//

/**
 * Zoom
 */
Electron.ipcRenderer.on('render_resetZoom', () => {
    if (frame) {
        if (!frame.removeProcess && typeof frame.setZoomLevel === 'function') {
            frame.setZoomLevel(0);
        }
    }
});

Electron.ipcRenderer.on('render_increaseZoom', () => {
    if (frame) {
        if (!frame.removeProcess && typeof frame.getZoomLevel === 'function') {
            let zoom = frame.getZoomLevel(),
                value = zoom + (frame.getZoomFactor() / 2);
            if (Math.floor(value) < 12)
                frame.setZoomLevel(value);
        }
    }
});

Electron.ipcRenderer.on('render_reduceZoom', () => {
    if (frame) {
        if (!frame.removeProcess && typeof frame.getZoomLevel === 'function') {
            let zoom = frame.getZoomLevel(),
                value = zoom - (frame.getZoomFactor() / 2);
            if (Math.floor(value) > -8)
                frame.setZoomLevel(value);
        }
    }
});

/**
 * Transition
 */
Electron.ipcRenderer.on('render_next', () => {
    if (frame && fileProcess === 'done') {
        removeFrame();
    }
});

Electron.ipcRenderer.on('render_return', () => {
    if (frame && fileProcess === 'done') {
        returnFrame();
    }
});

/**
 * URLs
 */
Electron.ipcRenderer.on('add_url', () => {
    if (urls) {
        while (frame && frame.fadeInInitial === 'processing...' ||
            frame && frame.removeProcess) return;
        load();
    }
});

/**
 * Frame
 */
function removeFrame() {
    if (urls.length <= 0) return;
    if (frame) {
        if (frame.removeProcess || frame.fadeInInitial === 'processing...') return;
        frame.removeProcess = true;
        $(frame).fadeOut('slow', function () {
            if (typeof urls[i - 1][0] === 'string') {
                urls[i - 1][0] = frame.getURL();
                urls[i - 1][1] = frame.getZoomLevel();
                save();
                clearInterval(interval), interval = null;
                frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                save();
                clearInterval(interval), interval = null;
                frame.remove();
                frame = null;
            }
        });
    }
};

function returnFrame() {
    if (urls.length <= 0) return;
    if (frame && i > 1) {
        if (frame.removeProcess || frame.fadeInInitial === 'processing...') return;
        frame.removeProcess = true;
        $(frame).fadeOut('slow', function () {
            if (typeof urls[i - 1][0] === 'string') {
                urls[i - 1][0] = frame.getURL();
                urls[i - 1][1] = frame.getZoomLevel();
                i = i - 2; save();
                clearInterval(interval), interval = null;
                frame.removeEventListener('did-finish-load', frame.listener);
                frame.remove();
                frame = null;
            } else if (
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'stream' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'image' ||
                typeof urls[i - 1][0] === 'object' && urls[i - 1][0]["type_url"] === 'video'
            ) {
                i = i - 2; save();
                clearInterval(interval), interval = null;
                frame.remove();
                frame = null;
            }
        });
    }
};

function DESKTOPCAPTURER() {
    const { desktopCapturer } = Electron;
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        for (const source of sources) {
            if (source.id === urls[i][0]["id"] && source.name === urls[i][0]["name"]) {
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
                let remove;
                sources.map(source => {
                    if (urls[i][0]["type_url"] === "stream") {
                        if (source.id != urls[i][0]["id"] &&
                            source.name === urls[i][0]["name"] ||
                            source.name != urls[i][0]["name"] &&
                            source.id === urls[i][0]["id"]) {
                            remove = true;
                        }
                    }
                });
                if (remove) remove_url(i);
            }
        }
    });

    function desktopCapturer_handleStream(stream) {
        $('.layerFrame').append(`<video id="stream" style="z-index: 1; display:inline-flexbox; width: 100vw; filter:opacity(0%);" />`);

        while (!frame) {
            frame = document.getElementById('stream');
        }

        frame.srcObject = stream;
        frame.onloadedmetadata = (e) => frame.play();

        if (!frame.fadeInInitial) {
            frame.fadeInInitial = 'processing...';
            $(frame).fadeOut(function () { $(frame).css('filter', 'opacity(100%)'); }).delay().fadeIn('slow', function () {
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

    while (!frame) {
        frame = document.getElementById('image');
    }

    if (!frame.fadeInInitial) {
        frame.fadeInInitial = 'processing...';
        $(frame).fadeOut(function () { $(frame).css('filter', 'opacity(100%)'); }).delay().fadeIn('slow', function () {
            frame.fadeInInitial = 'complete!';
            console.log('%c➠ LOG: Frame(Imagem) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
            interval = setInterval(frameInterval.bind(this, 'Imagem'), 1000);
        });
    }
    i++;
}

function VIDEORENDER() {
    $('.layerFrame').append(`<iframe id="video" src="${urls[i][0]["url"]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);"></iframe>`);

    while (!frame) {
        frame = document.getElementById('video');
    }

    if (!frame.fadeInInitial) {
        frame.fadeInInitial = 'processing...';
        $(frame).fadeOut(function () { $(frame).css('filter', 'opacity(100%)'); }).delay().fadeIn('slow', function () {
            frame.fadeInInitial = 'complete!';
            console.log('%c➠ LOG: Frame(Video) Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
            interval = setInterval(frameInterval.bind(this, 'video'), 1000);
        });
    }
    i++;
}

function frameInterval(type) {
    let frametime = ConfigGlobal.FRAMETIME,
        frametimetype = ConfigGlobal.FRAMETIMETYPE,
        frametype = () => {
            return String(type).toLowerCase() === 'frame' ? 'Frame' : `Frame(${type})`;
        };
    if (frame.tick === undefined ||
        !menu.getMenuItemById('PAUSE').checked && frame.tickReset) {
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
            if (!frame || frame.isLoading() ||
                frame.isLoadingMainFrame() ||
                frame.isWaitingForResponse() ||
                menu.getMenuItemById('PAUSE').checked ||
                frame.fadeInInitial === 'processing...' ||
                fileProcess === 'write...' ||
                fileProcess === 'reading...') return;
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
};

setInterval(function () {
    if (!frame) {
        if (i >= urls.length) i = 0;
        if (typeof urls[i][0] === 'string') {
            $('.layerFrame').append(`<webview id="frame" src="${urls[i++][0]}" style="z-index: 1; display:inline-flexbox; width: 100vw; height: 100vh; filter:opacity(0%);"></webview>`);

            while (!frame) {
                frame = document.getElementById('frame');
            }

            frame.listener = function () {
                console.log('%c➠ LOG: Frame Adicionado ✔', 'color: #405cff; padding: 8px; font-size: 150%;');
                if (!frame.fadeInInitial) {
                    frame.fadeInInitial = 'processing...';
                    $(frame).fadeOut(function () { $(frame).css('filter', 'opacity(100%)'); }).delay().fadeIn('slow', function () {
                        frame.fadeInInitial = 'complete!';
                    });
                }
                frame.setZoomLevel(urls[i - 1][1]);
                interval = setInterval(frameInterval.bind(this, 'Frame'), 1000);
            }
            frame.addEventListener('did-finish-load', frame.listener);
        } else if (typeof urls[i][0] === 'object' && urls[i][0]['type_url'] === 'stream') {
            DESKTOPCAPTURER()
        } else if (typeof urls[i][0] === 'object' && urls[i][0]['type_url'] === 'image') {
            IMGRENDER();
        } else if (typeof urls[i][0] === 'object' && urls[i][0]['type_url'] === 'video') {
            VIDEORENDER();
        }
    }
}, 1000);



Electron.ipcRenderer.on('frame_time_refresh', () => {
    if (!frame.tickReset) frame.tickReset = true;
    loadConfigGlobal();
});