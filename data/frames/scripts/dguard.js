/**
 * Process
 */
$(document).ready(() => {
    $(document.getElementsByName('username')[0]).val('__NAME__VALUE__');
    $(document.getElementsByName('username')[0]).change();

    $(document.getElementsByName('password')[0]).val('__PASS__VALUE__');
    $(document.getElementsByName('password')[0]).change();

    $(document.getElementsByClassName('md-primary md-raised md-button md-dguardlight-theme md-ink-ripple')[0]).click();

    setTimeout(function () {
        document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')[0].click();
        document.getElementsByClassName('md-accent md-icon-button md-button md-dguardlight-theme md-ink-ripple')['__LAYOUT_CAM__VALUE__'].click();
        setTimeout(function () {
            document.getElementsByClassName('md-no-style md-button md-dguardlight-theme md-ink-ripple flex')['__CAM__VALUE__'].click();
        }, 1000);
    }, 1000);
});