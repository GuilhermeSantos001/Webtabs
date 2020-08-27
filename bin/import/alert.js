/**
 * Imports
 */
const controller = require('../import/controller');

let i = 0;

function info(title = '', text = '', footer = 'Developer Team', delay = {
    active: true,
    time: 3600
}) {
    return new Promise(function (resolve, reject) {
        controller.defineAction('frameIsPause', true);

        $('#layerContainer').append(`\
            <div id="layerAlert${i}" class="alert alert-warning alert-dismissible fade show shadow border border-white bg-dark text-white text-justify overflow-auto" role="alert" \
            style="z-index: 99; width: 95vw; max-height: 95vh; \
            opacity: 0; position: fixed; top: .5vw; \
            left: 0; right: 0; margin-left: auto; margin-right: auto; padding: 1rem;"> \
            <a id="alert_close${i}" class="btn btn-outline-white float-right" role="button" \
            style="height: 1rem; color: white;"><i class="material-icons">clear</i></a> \
            <h1 class="text-uppercase">${String(title).length > 0 ? String(title): 'Mensagem do Sistema'}</h1><hr style="border-top: 1px solid white;" /> \
            <p id="alert_text${i}">${String(text).length > 0 ? String(`${String(text).replace(/\s{2}/g, "<br />")} <hr style="border-top: 1px solid white;" /> <span class="text-light">${footer}</span>`): 'Testando o sistema...'}</p> \
            </div>`.replace(/\s{2,}/g, ''));

        $(`#layerAlert${i}`).show("fast").animate({
            "opacity": 100
        }, "fast");

        if (i > 0) {
            $(`#layerAlert${i - 1}`).animate({
                "opacity": 0
            }, "fast").fadeOut("slow");
        }

        let event,
            index = i;

        if (typeof delay === 'object' && delay.active) {
            event = setTimeout(alertClose, delay.time);
        }

        function alertClose() {
            $(`#layerAlert${index}`).fadeOut("slow", function () {
                $(this).hide();
                if (event) clearTimeout(event);
                if (document.getElementById(`layerAlert${index}`)) {
                    document.getElementById(`layerAlert${index}`).remove();
                    controller.defineAction('frameIsPause', false);
                    resolve();
                }
            });
        }

        document.getElementById(`alert_close${i}`).onclick = alertClose.bind(this);

        document.addEventListener('keydown', event => {
            const keyName = event.key;
            if (
                keyName.toLowerCase() === 'escape' ||
                keyName.toLowerCase() === 'enter'
            ) alertClose.call(this);
        });

        i++;
    })
}

module.exports = {
    info
};