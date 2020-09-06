/**
 * Import
 */
const [{
        remote,
        ipcRenderer
    },
    path,
    ALERT,
    fs,
    menuManager,
    controller
] = [
    require('electron'),
    require('../import/localPath'),
    require('../import/alert'),
    require('fs'),
    require('../import/MenuManager'),
    require('../import/controller')
];

/**
 * Process
 */
$('.layerFrame').append(`
    <style>
        #layerContentsManager {
            height: 0vh;
            opacity: 0;
        }
    </style>

    <div id="layerContentsManager" class="bg-dark text-white col-12 overflow-auto fixed-top">
        <h1 class="text-uppercase font-weight-bold border border-light p-2 text-center">Conteúdos para exibição</h1>
        <ul id="layerAddContentsManagerList" class="list-group"></ul>
        <button type="button" class="btn btn-lg btn-block btn-outline-light mb-2"
            id="button_exit_contentsManager">Voltar</button>
    </div>

    <script>
        $('#layerContentsManager').hide(function () {
            initialize();
        });

        function initialize() {
            let data_urls = [],
                web_cookies = {},
                data_change = false;

            if (fs.existsSync(path.localPath('storage/urls.json'))) {
                data_urls = JSON.parse(fs.readFileSync(path.localPath('storage/urls.json'), 'utf-8')) || [];
            }

            if (fs.existsSync(path.localPath('storage/webcookies.json'))) {
                web_cookies = JSON.parse(fs.readFileSync(path.localPath('storage/webcookies.json'), 'utf-8')) || {
                    'size': 0
                };
            }

            data_change = false;

            if (data_urls.length > 0) {
                let position = 1;

                $('#layerAddContentsManagerList').children().toArray().forEach($this => $($this).remove());

                for (const url of data_urls) {
                    let currentReference = {};

                    if (url[0] instanceof Object === false) {
                        currentReference = {
                            url: String(url[0]).toUpperCase(),
                            title: String(url[3]).toUpperCase(),
                            type_url: 'URL',
                            edit: true
                        }
                    } else {
                        currentReference = {
                            url: String(url[0].name).toUpperCase(),
                            title: String(url[0].title).toUpperCase(),
                            type_url: String(url[0].type_url).toUpperCase(),
                            edit: false
                        }
                    }

                    $('#layerAddContentsManagerList').append(\`\
                    <li sequence="\${position}" class="list-group-item border border-light bg-dark text-white mb-2 liEllipsis">\
                    <div class="card col-12 border border-dark bg-dark text-white">\
                    <div class="card-body">\
                    <h4 class="card-title">\${currentReference.title || 'Desconhecido'}</h4>\
                    <h5 class="card-subtitle mb-2 text-muted">Tipo - \${currentReference.type_url}</h5>\
                    <hr class="bg-light">\
                    <input type="text" class="form-control mb-2" id="input_edit_content_url" placeholder="Insira a url..." value="\${currentReference.url}" \${currentReference.edit ? "" : "disabled"}>\
                    <button id="up_item_\${position}_content" type="button" class="btn btn-light btn-block upButton" \${position <= 1 ? "disabled" : ""}>Subir</button>\
                    <button id="down_item_\${position}_content" type="button" class="btn btn-light btn-block downButton" \${position >= data_urls.length ? "disabled" : ""}>Descer</button>\
                    <button id="remove_item\${position}_content" type="button" class="btn btn-light btn-block">Remover</button>\
                    </div></div></li>\
                    \`);

                    $(\`#up_item_\${position}_content\`).on('click', function () {
                        var hook = $(this).closest('.liEllipsis').prev('.liEllipsis'),
                            elementToMove = $(this).closest('.liEllipsis').detach();

                        hook.before(elementToMove);

                        /**
                         * Reset buttons of elements
                         */
                        hook.find('.upButton, .downButton').attr('disabled', false);
                        elementToMove.find('.upButton, .downButton').attr('disabled', false);

                        /**
                         * Configure buttons of elements
                         */
                        if ($('.liEllipsis').first().is(elementToMove)) {
                            if (!$(this).is('[disabled=disabled]')) $(this).attr('disabled', true);
                        }

                        if ($('.liEllipsis').last().is(hook)) {
                            hook.find('.downButton').attr('disabled', true);
                        }

                        /**
                         * Configure element in list
                         */
                        let currentSequence = elementToMove.attr('sequence'),
                            beforeSequence = hook.attr('sequence'),
                            data = data_urls.slice(0);

                        /**
                         * Verify if elements contain cookie
                         */
                        if (
                            data[Number(currentSequence) - 1][0] instanceof Object === false &&
                            data[Number(beforeSequence) - 1][0] instanceof Object === false
                        ) {
                            let cookieId = Number(String(data[Number(currentSequence) - 1][2]).replace('cookie_',
                                ''));

                            /**
                             * Configure CookieID
                             */
                            data[Number(currentSequence) - 1][2] = \`cookie_\${cookieId - 1}\`;
                            data[Number(beforeSequence) - 1][2] = \`cookie_\${cookieId}\`;
                        }

                        /**
                         * Move element in list
                         */
                        let currentItem = data[Number(currentSequence) - 1],
                            beforeItem = data[Number(beforeSequence) - 1];

                        /**
                         * Animate List
                         */
                        hook.attr('sequence', currentSequence);
                        elementToMove.attr('sequence', beforeSequence);

                        /**
                         * Change elements in list
                         */
                        data.splice(Number(currentSequence) - 1, 1, beforeItem);
                        data.splice(Number(beforeSequence) - 1, 1, currentItem);

                        /**
                         * Verify if elements contain cookie
                         */
                        if (
                            currentItem[0] instanceof Object === false &&
                            beforeItem[0] instanceof Object === false
                        ) {
                            /**
                             * Configure webcookies of element
                             */
                            if (web_cookies[currentItem[2]]) {
                                let currentWebCookie = web_cookies[currentItem[2]],
                                    beforeWebCookie = web_cookies[beforeItem[2]];
                                web_cookies[currentItem[2]] = beforeWebCookie;
                                web_cookies[beforeItem[2]] = currentWebCookie;
                            }
                        }

                        /**
                         * Save changes in data
                         */
                        data_urls = data;
                        data_change = true;
                    });

                    $(\`#down_item_\${position}_content\`).on('click', function () {
                        let hook = $(this).closest('.liEllipsis').next('.liEllipsis'),
                            elementToMove = $(this).closest('.liEllipsis').detach();

                        hook.after(elementToMove);

                        /**
                         * Reset buttons of elements
                         */
                        hook.find('.upButton, .downButton').attr('disabled', false);
                        elementToMove.find('.upButton, .downButton').attr('disabled', false);

                        /**
                         * Configure buttons of elements
                         */
                        if ($('.liEllipsis').last().is(elementToMove)) {
                            if (!$(this).is('[disabled=disabled]')) $(this).attr('disabled', true);
                        }
                        if ($('.liEllipsis').first().is(hook)) {
                            hook.find('.upButton').attr('disabled', true);
                        }

                        /**
                         * Configure element in list
                         */
                        let currentSequence = elementToMove.attr('sequence'),
                            nextSequence = hook.attr('sequence'),
                            data = data_urls.slice(0);

                        /**
                         * Verify if elements contain cookie
                         */
                        if (
                            data[Number(currentSequence) - 1][0] instanceof Object === false &&
                            data[Number(nextSequence) - 1][0] instanceof Object === false
                        ) {
                            let cookieId = Number(String(data[Number(currentSequence) - 1][2]).replace('cookie_',
                                ''));

                            /**
                             * Configure CookieID
                             */
                            data[Number(currentSequence) - 1][2] = \`cookie_\${cookieId + 1}\`;
                            data[Number(nextSequence) - 1][2] = \`cookie_\${cookieId}\`;
                        }

                        /**
                         * Move element in list
                         */
                        let currentItem = data[Number(currentSequence) - 1],
                            nextItem = data[Number(nextSequence) - 1];

                        /**
                         * Animate List
                         */
                        hook.attr('sequence', currentSequence);
                        elementToMove.attr('sequence', nextSequence);

                        /**
                         * Change elements in list
                         */
                        data.splice(Number(currentSequence) - 1, 1, nextItem);
                        data.splice(Number(nextSequence) - 1, 1, currentItem);

                        /**
                         * Verify if elements contain cookie
                         */
                        if (
                            currentItem[0] instanceof Object === false &&
                            nextItem[0] instanceof Object === false
                        ) {
                            /**
                             * Configure webcookies of element
                             */
                            if (web_cookies[currentItem[2]]) {
                                let currentWebCookie = web_cookies[currentItem[2]],
                                    nextWebCookie = web_cookies[nextItem[2]];
                                web_cookies[currentItem[2]] = nextWebCookie;
                                web_cookies[nextItem[2]] = currentWebCookie;
                            }
                        }

                        /**
                         * Save changes in data
                         */
                        data_urls = data;
                        data_change = true;
                    });

                    $(\`#remove_item\${position}_content\`).on('click', function () {
                        let hooks = [
                                $(this).closest('.liEllipsis').prev('.liEllipsis'),
                                $(this).closest('.liEllipsis').next('.liEllipsis')
                            ],
                            elementCurrent = $(this).closest('.liEllipsis').detach(),
                            append = false;

                        elementCurrent.remove();

                        hooks.map((hook, index) => {
                            if (hook.length >= 1 && !append) {
                                append = true;

                                hook.find('.upButton, .downButton').attr('disabled', false);

                                if ($('.liEllipsis').first().is(hook)) {
                                    hook.find('.upButton').attr('disabled', true);
                                }

                                if ($('.liEllipsis').last().is(hook)) {
                                    hook.find('.downButton').attr('disabled', true);
                                }

                                let currentSequence = elementCurrent.attr('sequence'),
                                    otherSequence = hook.attr('sequence'),
                                    data = data_urls.slice(0);

                                /**
                                 * Move element in list
                                 */
                                let currentItem = data[Number(currentSequence) - 1],
                                    otherItem = data[Number(otherSequence) - 1];

                                /**
                                 * Change Sequence of element
                                 */
                                hook.attr('sequence', currentSequence);

                                /**
                                 * Change elements in list
                                 */
                                data.splice(Number(currentSequence) - 1, 1, otherItem);
                                data.splice(Number(otherSequence) - 1, 1);

                                /**
                                 * Verify if elements contain cookie
                                 */
                                if (
                                    currentItem[0] instanceof Object === false
                                ) {
                                    /**
                                     * Remove webcookies of element
                                     */
                                    if (web_cookies[currentItem[2]]) {
                                        delete web_cookies[currentItem[2]];

                                        let count = 0,
                                            cookies = {};

                                        Object.keys(web_cookies).map(cookie => {
                                            if (String(cookie).indexOf('cookie_') != -1) {
                                                web_cookies[\`cookie_\${++count}\`] =
                                                    web_cookies[cookie];
                                                if (\`cookie_\${count}\` !== cookie)
                                                    delete web_cookies[cookie];
                                            }
                                        });

                                        web_cookies.size = count;

                                        count = 0;

                                        data.map(_url => {
                                            if (String(_url[2]).indexOf('cookie_') != -1) {
                                                _url[2] = \`cookie_\${++count}\`;
                                            }
                                        });
                                    }
                                }

                                /**
                                 * Save changes in data
                                 */
                                data_urls = data;
                                data_change = true;
                            }
                        })
                    });

                    $('#button_exit_contentsManager').on('click', function () {
                        $('#layerContentsManager').animate({
                            "height": "0vh",
                            "opacity": 0
                        }, "fast").hide("fast");
                        if (data_change) {
                            if (data_urls.length > 0) {
                                fs.writeFileSync(path.localPath('storage/urls.json'), Buffer.from(JSON.stringify(data_urls), 'utf-8'), {flag: 'w+'});
                            }
                            if (web_cookies instanceof Object) {
                                fs.writeFileSync(path.localPath('storage/webcookies.json'), Buffer.from(JSON.stringify(web_cookies), 'utf-8'), {flag: 'w+'});
                            }
                            remote.getCurrentWindow().webContents.reload();
                        }
                        remote.getCurrentWindow().webContents.send('window_contents_manager_menu_clear');
                        remote.getCurrentWindow().webContents.send('render_frameResume');
                    });

                    /**
                     * Next Position
                     */
                    position++;
                }
            }
        }
    </script>
`.trim());

/**
 * Events
 */
ipcRenderer
    .on('window_contents_manager', () => {
        if (menuManager.isClear() && !controller.frameEmpty()) {
            $('#layerContentsManager').show("fast").animate({
                "height": "100vh",
                "opacity": 100
            }, "fast");
            menuManager.setMenu('contentsManager');
            remote.getCurrentWindow().webContents.send('render_framePause');
            initialize();
        } else {
            if (menuManager.isMenu('contentsManager')) {
                $('#button_exit_contentsManager').click();
            }
        }
    })
    .on('window_contents_manager_menu_clear', () => {
        menuManager.clear();
    });