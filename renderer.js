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

    section_websites_append(id, name, section, loadurl, removeurl) {
        $("#section_websites").append(`\
        <div id="${section}" class="section">\
        <div class="col s12 blue accent-2">\
        <h5 class="white-text">${name}</h5>\
        </div>\
        <button id="${loadurl}" class="btn white black-text col s12 waves-effect waves-grey" type="submit"\
        name="action" style="margin-bottom: 5px;">Carregar\
        <i class="material-icons right">web</i>\
        </button>\
        <button id="${removeurl}" class="btn white black-text col s12 waves-effect waves-grey" type="submit" name="action"\
        style="margin-bottom: 10px;">Remover\
        <i class="material-icons right">delete</i>\
        </button>\
        </div>\
    `);
        $(`#${loadurl}`).click(() => {
            page.urls.seturl(id);
        });
        $(`#${removeurl}`).click(() => {
            page.urls.remove(id, `#${section}`);
        });
    }

    initializeURLs() {
        this.urls = {
            data: require(require('./import/LocalPath').resolve('settings\\websites')),
            add: (name, url) => {
                let fs = require('fs'),
                    data = this.urls.data;
                if (data.websites.indexOf(name) == -1) {
                    let id = data.content.length,
                        section = `${name}_section`,
                        loadurl = `${name}_loadURL`,
                        removeurl = `${name}_removeURL`;
                    data.section.push([id, name, section, loadurl, removeurl]);
                    data.content.push(url);
                    data.websites.push(name);
                    this.section_websites_append(id, name, section, loadurl, removeurl);
                    fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                        JSON.stringify(data, null, 2));
                    $("#add_website_submit").prop('checked', false);
                }
            },
            remove: (indexOf, sectionID) => {
                let fs = require('fs'),
                    data = this.urls.data;
                if (data.content.length - 1 < 1) return;
                if (data.content[indexOf] != undefined) {
                    data.websites.splice(indexOf, 1);
                    data.content.splice(indexOf, 1);
                    data.section.splice(indexOf, 1);
                    if (data.counter == indexOf) {
                        this.timepage = null;
                        while (!data.content[indexOf]) { indexOf--; }
                        ipcRenderer.send('updateurlview', data.content[indexOf]);
                    }
                    let i = 0, l = data.content.length;
                    data.section.forEach(content => {
                        if (data.counter == content[0])
                            data.counter = i, content[0] = i;
                        else
                            content[0] = i;
                        if (i < l) i++;
                    });
                    $(sectionID).fadeOut('slow', function () {
                        $(this).remove();
                        fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                            JSON.stringify(data, null, 2));
                    });
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
     * Buttons
     */
    $("#add_website_submit").click(() => {
        let name = $("#add_website_name").val(),
            url = $("#add_website_url").val();
        if (name.length <= 0 || url.length <= 0) return;
        name = name.replace(/["']/g, '');
        url = url.toLowerCase().replace(/\s{1,}/g, '');
        url = url.toLowerCase().replace(/[\\/]/g, '');
        if (url.substring(0, 5).match(/https/)) {
            url = url.toLowerCase().replace(/https:/g, '');
        } else {
            url = url.toLowerCase().replace(/http:/g, '');
        }
        ipcRenderer.send('debug', [name, url]);
        if ($("#add_website_submit").prop("checked")) {
            require('ping').sys.probe(url, isAlive => {
                if (isAlive) page.urls.add(name, require('normalize-url')(url));
            });
        }
    });

    /**
     * Render Websites List
     */
    (() => {
        let d = page.urls.data.section,
            i = 0,
            l = d.length
        for (; i < l; i++) {
            let content = d[i];
            page.section_websites_append(
                content[0],
                content[1],
                content[2],
                content[3],
                content[4]
            );
        }
    })();
});