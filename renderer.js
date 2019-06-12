// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/**
 * Import
 */
const { ipcRenderer } = require('electron');

/**
 * Class
 */
class Page {
    constructor() {
        this.initialize.apply(this, arguments);
    };

    static convertzoom(zoom) {
        if (zoom == 200)
            return 2.0;
        else if (zoom == 190)
            return 1.9;
        else if (zoom == 180)
            return 1.8;
        else if (zoom == 170)
            return 1.7;
        else if (zoom == 160)
            return 1.6;
        else if (zoom == 150)
            return 1.5;
        else if (zoom == 140)
            return 1.4;
        else if (zoom == 130)
            return 1.3;
        else if (zoom == 120)
            return 1.2;
        else if (zoom == 110)
            return 1.1;
        else if (zoom == 100)
            return 1.0;
        else if (zoom == 90)
            return 0.9;
        else if (zoom == 90)
            return 0.9;
        else if (zoom == 80)
            return 0.8;
        else if (zoom == 70)
            return 0.7;
        else if (zoom == 60)
            return 0.6;
        else if (zoom == 50)
            return 0.5;
        else if (zoom == 40)
            return 0.4;
        else if (zoom == 30)
            return 0.3;
        else if (zoom == 20)
            return 0.2;
        else if (zoom == 10)
            return 0.1;
    };

    initialize() {
        this.setzoom();
        this.setfullscreen();
        this.initializeURLs();
        this.update();
    };

    setzoom(zoom) {
        if (zoom === undefined)
            ipcRenderer.send('updatezoomview', Page.convertzoom(settings.geral.zoompage));
        else
            ipcRenderer.send('updatezoomview', Page.convertzoom(zoom));
    };

    setfullscreen(fullscreen) {
        if (fullscreen === undefined)
            ipcRenderer.send('updatefullscreenview', settings.geral.fullscreen);
        else
            ipcRenderer.send('updatefullscreenview', fullscreen);
    };

    initializeURLs() {
        this.urls = {
            data: require(require('./import/LocalPath').resolve('settings\\websites')),
            remove: (indexOf, sectionID) => {
                let fs = require('fs'),
                    data = this.urls.data,
                    nextURL = data.content[data.counter + 1];
                if (data.content.length - 1 < 1) return;
                if (data.content[indexOf] != undefined) {
                    data.content.splice(indexOf, 1);
                    data.section.splice(indexOf, 1);
                    if (data.counter == indexOf) {
                        this.timepage = null;
                        ipcRenderer.send('updateurlview', nextURL);
                    }
                    if (data.counter + 1 < data.content.length - 1) data.counter++;
                    else if (data.counter > data.content.length - 1) data.counter--;
                    fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                        JSON.stringify(data, null, 2));
                    $(sectionID).fadeOut('slow', function () { $(this).remove(); });
                }
            },
            start: () => {
                ipcRenderer.send('updateurlview', this.urls.data.content[this.urls.data.counter]);
            },
            seturl: (indexOf) => {
                let fs = require('fs'),
                    data = this.urls.data,
                    content = data.content,
                    i = data.counter;
                if (content[indexOf] != undefined) {
                    if (content[i] != ipcRenderer.sendSync('geturlview')) content[i] = ipcRenderer.sendSync('geturlview');
                    i = indexOf, data.counter = i;
                    fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                        JSON.stringify(data, null, 2));
                    this.timepage = null;
                    ipcRenderer.send('updateurlview', content[i]);
                }
            },
            change: () => {
                let fs = require('fs'),
                    data = this.urls.data,
                    content = data.content,
                    i = data.counter;
                if (content[i] != ipcRenderer.sendSync('geturlview')) content[i] = ipcRenderer.sendSync('geturlview');
                i < content.length - 1 ? i++ : i = 0, data.counter = i;
                fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                    JSON.stringify(data, null, 2));
                ipcRenderer.send('updateurlview', content[i]);
            }
        };
        this.urls.start();
    }

    update() {
        setInterval(() => {
            this.timepageUpdate();
        }, 1000);
    };

    timepageUpdate() {
        if (!this.timepage)
            this.timepage = {};
        if (this.timepage.second === undefined)
            this.timepage.second = 0;
        if (this.timepage.minute === undefined)
            this.timepage.minute = 0;
        if (this.timepage.second < 60)
            this.timepage.second++;
        else {
            this.timepage.second = 0;
            if (this.timepage.minute < 60)
                this.timepage.minute++;
            else
                this.timepage.minute = 0;
        }
        if (this.timepage.minute >= $('#timepage').val()) {
            this.timepage = null;
            this.urls.change();
        }
    };
};

/**
 * Variables
 */
const settings = {
    geral: require('./settings/geral')
},
    page = new Page();


/**
 * Jquery
 */
$(document).ready(function () {
    /**
     * Initialize
     */
    $('.collapsible').collapsible();
    $('select').material_select();

    /**
     * Process
     */
    $('#timepage').val(settings.geral.timepage);
    $('#timepage_label').text(`${settings.geral.timepage} min.`);
    $('#timepage').on('input', () => {
        let val = $('#timepage').val();
        $('#timepage_label').text(`${val} min.`);
        ipcRenderer.send('settings_update', ['timepage', val]);
    });

    $('#zoompage').val(settings.geral.zoompage);
    $('#zoompage_label').text(`${settings.geral.zoompage}%`);
    $('#zoompage').on('input', () => {
        let val = $('#zoompage').val();
        $('#zoompage_label').text(`${val}%`);
        ipcRenderer.send('settings_update', ['zoompage', val]);
        page.setzoom(val);
    });

    $('#fullscreen').prop('checked', settings.geral.fullscreen);
    $('#fullscreen').change(() => {
        let val = $('#fullscreen').is(":checked");
        ipcRenderer.send('settings_update', ['fullscreen', val]);
        page.setfullscreen(val);
    });


    /**
     * Render
     */
    (() => {
        let d = page.urls.data.section,
            i = 0,
            l = d.length
        for (; i < l; i++) {
            let content = d[i];
            $("#section_websites").append(`\
                <div id="${content[2]}" class="section">\
                <div class="col s12 blue accent-2">\
                <h5 class="white-text">${content[1]}</h5>\
                </div>\
                <button id="${content[3]}" class="btn white black-text col s12 waves-effect waves-grey" type="submit"\
                name="action" style="margin-bottom: 5px;">Carregar\
                <i class="material-icons right">web</i>\
                </button>\
                <button id="${content[4]}" class="btn white black-text col s12 waves-effect waves-grey" type="submit" name="action"\
                style="margin-bottom: 10px;">Remover\
                <i class="material-icons right">delete</i>\
                </button>\
                </div>\
            `);
            $(`#${content[3]}`).click(() => {
                page.urls.seturl(content[0]);
            });
            $(`#${content[4]}`).click(() => {
                page.urls.remove(content[0], `#${content[2]}`);
            });
        }
    })();
});