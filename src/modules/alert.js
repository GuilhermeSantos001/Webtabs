import $ from 'jquery/dist/jquery';

let i = 0;

function info(text) {
    $('#layerContainer').append(`\
        <div id="layerAlert${i}" class="alert alert-warning alert-dismissible fade show border border-light bg-dark text-white" role="alert" \
        style="z-index: 99; width: 98vw; \
        filter:opacity(0%); position: fixed; top: 1rem; \
        left: 1rem; padding: 1rem;"> \
        <a id="alert_close${i}" class="btn btn-outline-dark float-right" role="button" \
        style="height: .5rem; margin-top: -.5rem;"><i class="material-icons">clear</i></a> \
        <strong id="alert_text${i}">${text}</strong> \
        </div>`.replace(/\s{2,}/g, ''));
    $(`#layerAlert${i}`).hide().delay().css('filter', 'opacity(100%)').delay().fadeIn('slow');
    try { $(`#layerAlert${i - 1}`).fadeOut("slow"); } catch (e) { };
    let event = setTimeout(alertClose, 3500),
        index = i;
    function alertClose() {
        $(`#layerAlert${index}`).fadeOut("slow", function () {
            $(this).hide();
            clearTimeout(event);
            if (document.getElementById(`layerAlert${index}`))
                document.getElementById(`layerAlert${index}`).remove();
        });
    }
    document.getElementById(`alert_close${i}`).onclick = alertClose;
    i++;
}

export { info };