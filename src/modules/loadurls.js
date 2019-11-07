import * as ConfigGlobal from '../config/global';
import $ from 'jquery/dist/jquery';

let frame;
let interval;
let [urls, i, zoom] = [[
    'https://app.pipedrive.com/auth/login',
    'https://sla.performancelab.com.br/login.php?uri=%2F'
], 0, [0, 0]
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

        frame.addEventListener('did-finish-load', () => {
            console.log('FRAME ADICIONADO');
            frame.setZoomLevel(zoom[i - 1]);
            interval = setInterval(function () {
                while (frame.isLoading()) return;
                $(frame).fadeOut('slow', function () {
                    console.log('FRAME REMOVIDO');
                    urls[i - 1] = frame.getURL();
                    frame.remove();
                    clearInterval(interval);
                    interval = null;
                    frame = null;
                })
            }, ConfigGlobal.FRAMETIME);
        });
    }
}, ConfigGlobal.FRAMEUPDATETIME);