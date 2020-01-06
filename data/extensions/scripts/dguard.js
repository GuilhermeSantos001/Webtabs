/**
 * Process
 */
$(document).ready(() => {
    $(document.getElementsByName('username')[0]).val('__NAME__VALUE__');
    $(document.getElementsByName('username')[0]).change();

    $(document.getElementsByName('password')[0]).val('__PASS__VALUE__');
    $(document.getElementsByName('password')[0]).change();

    $(document.getElementsByClassName('md-primary md-raised md-button md-dguardlight-theme md-ink-ripple')[0]).delay().click();

    let intervals = [],
        reset = false;
    intervals[0] = setInterval(function () {
        if ($($('#errors').children()[0]).is(':visible')) {
            if (!reset) $("#errors").prepend(`<p id="reset"></p>`), reset = true;
        } else {
            if (reset) $("#reset").remove(), reset = false;
        }
        try {
            document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')[0].click();
            document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')['__LAYOUT_CAM__VALUE__'].click();
            clearInterval(intervals[0]);
            intervals[1] = setInterval(function () {
                try {
                    document.getElementsByClassName('md-no-style md-button md-dguardlight-theme md-ink-ripple flex')['__CAM__VALUE__'].click();
                    document.webtabs = true;
                    clearInterval(intervals[1]);
                    intervals = null;
                } catch (e) { console.error(e); }
            }, 1000);
        } catch (e) { console.error(e); };
    }, 1000);
});