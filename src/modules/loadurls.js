import * as ConfigGlobal from '../config/global';
import $ from 'jquery/dist/jquery';
import * as Electron from 'electron';

const { Menu } = Electron.remote.require('electron');

let menu = Menu.getApplicationMenu();
let frame;
let interval;
let [
    urls,
    i,
    zoom
] = [
        [
            'https://app.pipedrive.com/auth/login',
            'https://sla.performancelab.com.br/login.php?uri=%2F'
        ],
        0,
        [0, 0]
    ]

setInterval(function () {
    if (!frame) {
        if (!urls[i]) i = 0;
        $('.layerFrame').append(`\
        <webview id="frame" src="${urls[i++]}"\
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
            frame.setZoomLevel(zoom[i - 1]);
            interval = setInterval(function () {
                console.info('Frame Removido!');
                while (frame.isLoading() ||
                    frame.isLoadingMainFrame() ||
                    frame.isWaitingForResponse() ||
                    menu.getMenuItemById('PAUSE').checked ||
                    frame.fadeInInitial === 'processing...') return;
                $(frame).fadeOut('slow', function () {
                    urls[i - 1] = frame.getURL();
                    clearInterval(interval);
                    interval = null;
                    frame.remove(), frame = null;
                })
            }, ConfigGlobal.FRAMETIME);
        });
    }
}, 1000);