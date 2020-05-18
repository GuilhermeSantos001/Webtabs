let i = 0;

function info(title = '', text = '') {
    $('#layerContainer').append(`\
        <div id="layerAlert${i}" class="alert alert-warning alert-dismissible fade show shadow border border-white bg-dark text-white text-break overflow-auto" role="alert" \
        style="z-index: 99; width: 95vw; max-height: 95vh; \
        opacity: 0; position: fixed; top: .5vw; \
        left: 0; right: 0; margin-left: auto; margin-right: auto; padding: 1rem;"> \
        <a id="alert_close${i}" class="btn btn-outline-white float-right" role="button" \
        style="height: 1rem; margin-top: -1vw;"><i class="material-icons">clear</i></a> \
        <h1 class="text-uppercase">${title.length >0 ? title: 'Mensagem do Sistema'}</h1> \
        <strong id="alert_text${i}">${text.length >0 ? text: 'Testando o sistema...'}</strong> \
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

    if (text.length <= 100) event = setTimeout(alertClose, 3500);

    function alertClose() {
        $(`#layerAlert${index}`).fadeOut("slow", function () {
            $(this).hide();
            if (event) clearTimeout(event);
            if (document.getElementById(`layerAlert${index}`))
                document.getElementById(`layerAlert${index}`).remove();
        });
    }
    document.getElementById(`alert_close${i}`).onclick = alertClose.bind(this);
    i++;
}

module.exports = {
    info
};