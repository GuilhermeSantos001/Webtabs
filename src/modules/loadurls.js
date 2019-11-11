import * as ConfigGlobal from '../config/global';
import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';
import data_urls from '../config/data/urls.json';


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
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/urls.json');
    if (fs.existsSync(file)) {
        fileProcess = 'write...';
        fs.writeFile(file, JSON.stringify(urls, null, 2), 'utf8', () => {
            fileProcess = 'done';
        });
    }
};


function load() {
    let fs = Electron.remote.require('fs'),
        path = Electron.remote.require('path'),
        file = path.resolve('src/config/data/urls.json');
    if (fs.existsSync(file)) {
        fileProcess = 'reading...';
        let data = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
        if (data instanceof Array === true) {
            fileProcess = 'done';
            urls = data;
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
        if (!frame.removeProcess) {
            frame.setZoomLevel(0);
        }
    }
});

Electron.ipcRenderer.on('render_increaseZoom', () => {
    if (frame) {
        if (!frame.removeProcess) {
            let zoom = frame.getZoomLevel();
            frame.setZoomLevel(zoom + (frame.getZoomFactor() / 2));
        }
    }
});

Electron.ipcRenderer.on('render_reduceZoom', () => {
    if (frame) {
        if (!frame.removeProcess) {
            let zoom = frame.getZoomLevel();
            frame.setZoomLevel(zoom - (frame.getZoomFactor() / 2));
        }
    }
});

/**
 * Transition
 */
Electron.ipcRenderer.on('render_next', () => {
    if (frame) {
        removeFrame();
    }
});

Electron.ipcRenderer.on('render_return', () => {
    if (frame) {
        returnFrame();
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
            urls[i - 1][0] = frame.getURL();
            urls[i - 1][1] = frame.getZoomLevel();
            save();
            frame.remove(), frame = null;
            clearInterval(interval), interval = null;
        });
    }
};

function returnFrame() {
    if (urls.length <= 0) return;
    if (frame && i > 1) {
        if (frame.removeProcess || frame.fadeInInitial === 'processing...') return;
        frame.removeProcess = true;
        $(frame).fadeOut('slow', function () {
            urls[i - 1][0] = frame.getURL();
            urls[i - 1][1] = frame.getZoomLevel();
            i = i - 2; save();
            frame.remove(), frame = null;
            clearInterval(interval), interval = null;
        });
    }
};

setInterval(function () {
    if (!frame) {
        if (i >= urls.length) i = 0;
        $('.layerFrame').append(`\
        <webview id="frame" src="${urls[i++][0]}"\
            style="display:inline-flexbox; width: 100vw; height: 100vh;" nodeintegration nodeintegrationinsubframes plugins\
            disablewebsecurity allowpopups></webview>`.trim());

        while (!frame) {
            frame = document.getElementById('frame');
        }

        if (!frame.fadeInInitial) {
            frame.fadeInInitial = 'processing...';
            $(frame).fadeOut(100).delay(1000).fadeIn('slow', function () {
                frame.fadeInInitial = 'complete!';
            });
        }

        frame.addEventListener('did-finish-load', () => {
            console.info('Frame Adicionado!');
            frame.setZoomLevel(urls[i - 1][1]);
            interval = setInterval(function () {
                console.info('Frame Removido!');
                if (!frame || frame.isLoading() ||
                    frame.isLoadingMainFrame() ||
                    frame.isWaitingForResponse() ||
                    menu.getMenuItemById('PAUSE').checked ||
                    frame.fadeInInitial === 'processing...' ||
                    fileProcess === 'write...' ||
                    fileProcess === 'reading...') return;
                removeFrame();
            }, ConfigGlobal.FRAMETIME);
        });
    }
}, 1000);