// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/**
 * Import
 */
const { ipcRenderer, remote } = require('electron');

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
        let i = this.urls.data.counter,
            disabled = i == id ? 'disabled' : '';
        $("#section_websites").append(`\
        <div id="${section}" class="section">\
        <div class="col s12 blue accent-2">\
        <h5 class="white-text">${name}</h5>\
        </div>\
        <button id="${loadurl}" class="btn white black-text col s12 waves-effect waves-grey" type="submit"\
        name="action" style="margin-bottom: 5px;" ${disabled}>Carregar\
        <i class="material-icons right">web</i>\
        </button>\
        <button id="${removeurl}" class="btn white black-text col s12 waves-effect waves-grey" type="submit" name="action"\
        style="margin-bottom: 10px;">Remover\
        <i class="material-icons right">delete</i>\
        </button>\
        </div>\
    `);
        this.setclick_section_websites(id, loadurl, removeurl);
    }

    setclick_section_websites(id, loadurl, removeurl) {
        if (!this._loadurls) this._loadurls = [];
        if (!this._removeurls) this._removeurls = [];
        if (this._loadurls.indexOf(`#${loadurl}`) === -1) this._loadurls.push(`#${loadurl}`);
        if (this._removeurls.indexOf(`#${removeurl}`) === -1) this._removeurls.push(`#${removeurl}`);
        function loadURL() {
            this._loadurls.map(_loadurls => { $(_loadurls).prop('disabled', true); });
            this._removeurls.map(_removeurls => { $(_removeurls).prop('disabled', true); });
            page.urls.seturl(id);
        };
        function removeURL() {
            page.urls.remove(id);
        };
        document.getElementById(`${loadurl}`).onclick = loadURL.bind(this);
        document.getElementById(`${removeurl}`).onclick = removeURL.bind(this);
    }

    initializeURLs() {
        this.urls = {
            data: require(require('./import/LocalPath').resolve('settings\\websites')),
            add: (name, url) => {
                let fs = require('fs'),
                    data = this.urls.data,
                    assembled_name = name,
                    assembled_count = (() => {
                        return data.assembled_count[name] || 0;
                    })(),
                    assembled_join = false;
                if (data.content.indexOf(url) != -1) {
                    $("#add_website_url").val('');
                    $("#add_website_submit").prop('checked', false);
                    return;
                };
                if (data.websites.indexOf(assembled_name) != -1) {
                    assembled_name = `${name}_${++assembled_count}`;
                    assembled_join = true;
                }
                data.assembled_count[name] = assembled_count;
                if (assembled_join) name = assembled_name;
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
                $("#add_website_url").val('');
                $("#add_website_submit").prop('checked', false);
                window.scrollTo(0, 0);
            },
            remove: (indexOf) => {
                let fs = require('fs'),
                    data = this.urls.data;
                if (data.websites.length - 1 <= 0) return;
                if (typeof data.websites[indexOf] != 'undefined') {
                    this.timepage = 'pause';
                    const sectionID = `#${data.section[indexOf][2]}`;
                    let assembled_name = data.websites[indexOf]
                    if (typeof assembled_name === 'string') {
                        if (assembled_name.indexOf('_') != -1) {
                            assembled_name = assembled_name.substr(0, assembled_name.indexOf('_'));
                            if (typeof data.assembled_count[assembled_name] === 'number') {
                                if (data.assembled_count[assembled_name] > 0)
                                    data.assembled_count[assembled_name]--;
                                if (data.assembled_count[assembled_name] <= 0)
                                    delete data.assembled_count[assembled_name];
                            }
                        }
                    }
                    data.websites.splice(indexOf, 1);
                    data.content.splice(indexOf, 1);
                    data.section.splice(indexOf, 1);
                    const counter = data.counter;
                    if (data.counter > 0) data.counter--;
                    if (data.counter + 1 < data.content.length) data.counter++;
                    if (counter == indexOf) {
                        this._loadurls.map(_loadurls => { $(_loadurls).prop('disabled', true); });
                        this._removeurls.map(_removeurls => { $(_removeurls).prop('disabled', true); });
                        this.timepage = 'pause';
                        this._loadURL = this._URL;
                        ipcRenderer.send('updateurlview', data.content[data.counter]);
                    }
                    let i = 0, l = data.content.length;
                    data.section.forEach(content => {
                        content[0] = i;
                        this.setclick_section_websites(content[0], content[3], content[4]);
                        if (i < l) i++;
                    }, this);
                    function sectionClear() {
                        fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                            JSON.stringify(data, null, 2));
                        this.timepage = null;
                        $(sectionID).remove();
                    }
                    $(sectionID).fadeOut('slow', sectionClear.bind(this));
                }
            },
            start: () => {
                ipcRenderer.send('updateurlview', this.urls.data.content[this.urls.data.counter]);
            },
            seturl: (indexOf) => {
                let fs = require('fs'),
                    data = this.urls.data,
                    websites = data.websites,
                    content = data.content,
                    i = data.counter;
                if (content[indexOf] != undefined) {
                    this.timepage = 'pause';
                    this._loadURL = content[i];
                    let website = websites[i]
                        .toLowerCase()
                        .replace(/\s{1,}/g, ''),
                        url = this._URL.toLowerCase().replace(/\s{1,}/g, '');
                    if (website.indexOf('_') != -1) website = website.substr(0, website.indexOf('_'));
                    if (url.indexOf(website) != -1) {
                        if (content[i] != this._URL)
                            content[i] = this._URL;
                    } else {
                        this.timepage = 'pause';
                        this._loadURL = '???';
                        return;
                    }
                    i = indexOf, data.counter = i;
                    ipcRenderer.send('updateurlview', content[i]);
                    fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                        JSON.stringify(data, null, 2));
                }
            },
            change: () => {
                let fs = require('fs'),
                    data = this.urls.data,
                    content = data.content,
                    websites = data.websites,
                    i = data.counter,
                    website = websites[i].toLowerCase().replace(/\s{1,}/g, ''),
                    url = this._URL.toLowerCase().replace(/\s{1,}/g, '');
                this._loadurls.map(_loadurls => { $(_loadurls).prop('disabled', true); });
                this._removeurls.map(_removeurls => { $(_removeurls).prop('disabled', true); });
                if (url.search(website) != -1) {
                    if (content[i] != this._URL)
                        content[i] = this._URL;
                } else {
                    this.timepage = 'pause';
                    this._loadURL = '???';
                    return;
                }
                i < content.length - 1 ? i++ : i = 0, data.counter = i;
                ipcRenderer.send('updateurlview', content[i]);
                fs.writeFileSync(require('./import/LocalPath').resolve('settings\\websites.json'),
                    JSON.stringify(data, null, 2));
            }
        };
        this.urls.start();
    }

    update() {
        setInterval(() => {
            this.updateURL();
            this.updateLoadURL();
            this.timepageUpdate();
        }, 500);
    };

    updateURL() {
        if (this._URL != ipcRenderer.sendSync('geturlview')) {
            this._URL = ipcRenderer.sendSync('geturlview');
            this.timepage = null;
        }
    };

    updateLoadURL() {
        if (this._loadURL) {
            if (this._loadURL != this._URL) {
                this._loadurls.map(_loadurls => {
                    let data = this.urls.data,
                        i = data.counter,
                        loadurl = `#${data.section[i][3]}`;
                    if (_loadurls != loadurl)
                        $(_loadurls).prop('disabled', false);
                });
                this._removeurls.map(_removeurls => { $(_removeurls).prop('disabled', false); });
                this._loadURL = null;
            }
        }
    };

    timepageUpdate() {
        if (this.timepage === 'pause') return;
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
            this.timepage = 'pause';
            this._loadURL = this._URL;
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
        let delay = setTimeout(() => {
            let url = $("#add_website_url").val();
            if (url.length <= 0) {
                clearpropswebsite();
            }
            if ($("#add_website_submit").prop("checked") && url.length > 0) {
                if (require("valid-url").isWebUri(url)) {
                    websiteadd(require("url").parse(url).hostname, url);
                }
                else {
                    require('ping').sys.probe(url, isAlive => {
                        if (isAlive) {
                            if (url.includes('www.')) url = url.replace('www.', 'https://');
                            websiteadd(require("url").parse(url).hostname, url);
                        } else clearpropswebsite();
                    });
                }
            }
            function websiteadd(name, url) {
                name = name.toLowerCase().replace(/\s{1,}/g, '');
                if (name.includes('www')) name = name.substr(4);
                while (name.includes('.')) {
                    let i = name.indexOf('.'), l = (() => {
                        return i < name.lastIndexOf('.') ?
                            name.lastIndexOf('.') : name.length;
                    })(),
                        s = '';
                    for (; i < l; i++) {
                        s += name[i];
                    }
                    name = name.replace(s, '');
                }

                page.urls.add(name.charAt(0).toUpperCase() + name.slice(1), url);
                clearpropswebsite();
            }
            function clearpropswebsite() {
                $("#add_website_url").val('');
                $("#add_website_submit").prop('checked', false);
            }
            return clearTimeout(delay);
        }, 1000);
    });

    $("#menu_hide").click(() => {
        $("#menu").animate({
            "margin-left": "-=300"
        }, () => {
            ipcRenderer.send('menuhide');
        });
    });

    $("#exit_app").click(() => {
        remote.getCurrentWindow().close();
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

    /**
     * Listeners
     */
    ipcRenderer
        .on('menushow', event => {
            $("#menu").animate({
                "margin-left": "+=300"
            });
        })
        .on('togglefullscreen', (event, arg) => {
            $('#fullscreen').prop('checked', Boolean(arg));
        });
});