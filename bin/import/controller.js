const {
    remote
} = require('electron');

const api = require('./api'),
    ALERT = require('./alert'),
    chkurl = require('./checking_url');

function CONTROLLER() {
    throw new Error('This is a static class');
}

CONTROLLER.versionSystem = 'v5.35.43-build';
CONTROLLER.changelog = {};
CONTROLLER.action = {};

/**
 * CHANGELOG
 */
CONTROLLER.changelog.paths = {};
CONTROLLER.changelog.paths.folder = 'storage/changelog/';
CONTROLLER.changelog.paths.file = filename => String(CONTROLLER.changelog.paths.folder + filename);

CONTROLLER.changelog.resetShowChangelog = function () {
    CONTROLLER.defineAction('showchangelog', false);

    let path = require('../import/localPath'),
        fs = require('fs');

    const pathFileData = path.localPath(CONTROLLER.changelog.paths.file('registry.json'));
    let registry = {};

    if (fs.existsSync(pathFileData)) {
        try {
            registry = JSON.parse(fs.readFileSync(pathFileData, 'utf-8'));
        } catch (error) {
            return console.log(error);
        }
    }

    registry[CONTROLLER.versionSystem] = false;
    fs.writeFileSync(pathFileData, Buffer.from(JSON.stringify(registry), 'utf-8'), {
        flag: 'w+'
    });
};

CONTROLLER.changelog.initialize = function () {
    CONTROLLER.defineAction('showchangelog', true);

    let path = require('../import/localPath'),
        fs = require('fs');

    const pathFolder = path.localPath(this.paths.folder);
    if (!fs.existsSync(pathFolder)) fs.mkdirSync(pathFolder);

    const pathFileData = path.localPath(CONTROLLER.changelog.paths.file('registry.json'));
    let registry = {};

    if (fs.existsSync(pathFileData)) {
        try {
            registry = JSON.parse(fs.readFileSync(pathFileData, 'utf-8'));
        } catch (error) {
            return console.log(error);
        }
    }

    api.get('https://raw.githubusercontent.com/GuilhermeSantos001/updates_files/master/WebTabs/changelog/changelog.json')
        .then(function (response) {
            const {
                data
            } = response;

            if (data instanceof Array) {
                data.map(update => {
                    if (CONTROLLER.versionSystem == update['update']) {
                        if (!registry[CONTROLLER.versionSystem])
                            showChangelog(update['title'], update['content'], update['date']);
                    }
                });
            }
        })
        .catch(function () {});

    function showChangelog(title, url, date) {
        api.get(url)
            .then(function (response) {
                const {
                    data
                } = response;

                ALERT.info(title, data, `Lançado em ${date}.`, {
                    active: false
                }).then(() => {
                    registry[CONTROLLER.versionSystem] = true;
                    fs.writeFileSync(pathFileData, Buffer.from(JSON.stringify(registry), 'utf-8'), {
                        flag: 'w+'
                    });
                }).catch(() => {});
            })
            .catch(function () {});
    }
};

/**
 * CONTROL SERVER
 */
CONTROLLER.server = {};
CONTROLLER.server.history = [];

CONTROLLER.server.initialize = function (loaders = 'all') {
    if (loaders === 'all' || loaders === 'default')
        if (!CONTROLLER.action('control_server_initialize')) {
            CONTROLLER.defineAction('control_server_initialize', true);
            CONTROLLER.serverCommandsGet();
        }

    if (loaders === 'all' || loaders === 'managerFrame')
        if (!CONTROLLER.action('control_managerFrame_initialize')) {
            CONTROLLER.defineAction('control_managerFrame_initialize', true);
            CONTROLLER.serverCommandsManagerFrame();
        }
};

CONTROLLER.serverLoginData = function () {
    let path = require('../import/localPath'),
        fs = require('fs');

    let file = path.localPath('configs/global.json'),
        data = [];

    if (path.localPathExists('configs/global.json')) {
        let read = JSON.parse(fs.readFileSync(file, 'utf-8'));

        if (read instanceof Object === true) {
            data = read;
        }
    }

    return data;
};

CONTROLLER.serverCommandsGet = function () {
    const {
        SERVERLOGINUSER,
        SERVERLOGINPASS
    } = this.serverLoginData();

    api.get(undefined, 'commands/all', {
        user: SERVERLOGINUSER,
        pass: SERVERLOGINPASS
    }).then(function (response) {
        const {
            data
        } = response;

        try {
            const {
                result
            } = data;

            if (result instanceof Array) {
                CONTROLLER.serverCommandsProcess(result);
            } else {
                CONTROLLER.defineAction('control_server_initialize', false);
            }
        } catch (error) {
            return CONTROLLER.defineAction('control_server_initialize', false);
        }
    })
};

CONTROLLER.serverCommandsProcess = function (commands) {
    const history = this.server.history;
    const command = commands[0];
    if (history.filter(id => id == command.id).length <= 0) {
        this.server.history.push(command.id);
        switch (command.value) {
            case 'render_reload':
                this.serverCommandsClear(command.id);
                remote.getCurrentWindow().webContents.send('window_frame_reload');
                break;
            case 'render_next':
                this.defineAction('control_server_command_id', command.id);
                this.defineAction('control_server_render_process', true);
                remote.getCurrentWindow().webContents.send('render_next');
                break;
            case 'render_return':
                this.defineAction('control_server_command_id', command.id);
                this.defineAction('control_server_render_process', true);
                remote.getCurrentWindow().webContents.send('render_return');
                break;
            case 'render_fullscreen':
                this.serverCommandsClear(command.id);
                remote.getCurrentWindow().setFullScreen(remote.getCurrentWindow().isFullScreen() ? false : true);
                break;
            case 'render_menubarshow':
                this.serverCommandsClear(command.id);
                remote.getCurrentWindow().setMenuBarVisibility(true);
                remote.getCurrentWindow().setAutoHideMenuBar(false);
                break;
            case 'render_menubarhide':
                this.serverCommandsClear(command.id);
                remote.getCurrentWindow().setMenuBarVisibility(false);
                remote.getCurrentWindow().setAutoHideMenuBar(true);
                break;
            case 'render_mouseshow':
                this.serverCommandsClear(command.id);
                remote.getCurrentWindow().webContents.send('window_show_cursor');
                break;
            case 'render_mousehide':
                this.serverCommandsClear(command.id);
                remote.getCurrentWindow().webContents.send('window_hide_cursor');
                break;
            case 'render_running':
                this.serverCommandsClear(command.id);
                remote.Menu.getApplicationMenu().getMenuItemById('frame_running').click();
                break;
            case 'render_pause':
                this.serverCommandsClear(command.id);
                remote.Menu.getApplicationMenu().getMenuItemById('PAUSE').click();
                break;
            case 'system_toogledevtools':
                this.serverCommandsClear(command.id);
                if (!remote.getCurrentWindow().webContents.isDevToolsOpened()) {
                    remote.getCurrentWindow().webContents.openDevTools();
                } else {
                    remote.getCurrentWindow().webContents.closeDevTools();
                }
                break;
            case 'system_tooglereload':
                this.serverCommandsClear(command.id)
                    .then(() => {
                        remote.Menu.getApplicationMenu().getMenuItemById('system_tooglereload').click();
                    })
                break;
        }
    } else {
        this.defineAction('control_server_initialize', false);
    }
};

CONTROLLER.serverCommandsClear = function (id = '') {
    const {
        SERVERLOGINUSER,
        SERVERLOGINPASS
    } = this.serverLoginData();

    this.defineAction('control_server_command_id', null);
    return new Promise((resolve, reject) => {
        api.post(undefined, id == '' ? `commands/clear` : `commands/clear/${id}`, {
                user: SERVERLOGINUSER,
                pass: SERVERLOGINPASS
            })
            .catch(err => {
                if (typeof reject === 'function') reject(err);
            })
            .then(res => {
                if (typeof resolve === 'function') resolve(res);
                CONTROLLER.defineAction('control_server_initialize', false);
            });
    });
};

CONTROLLER.serverCommandsManagerFrame = function () {
    const {
        SERVERLOGINUSER,
        SERVERLOGINPASS
    } = this.serverLoginData();

    api.get(undefined, 'managerFrame/command/all', {
        user: SERVERLOGINUSER,
        pass: SERVERLOGINPASS
    }).then(function (response) {
        const {
            data
        } = response;

        try {
            const {
                result
            } = data;

            if (result instanceof Array) {
                CONTROLLER.serverCommandsManagerFrameProcess(result);
            } else {
                CONTROLLER.defineAction('control_managerFrame_initialize', false);
            }
        } catch (error) {
            return CONTROLLER.defineAction('control_managerFrame_initialize', false);
        }
    })
};

CONTROLLER.serverCommandsManagerFrameProcess = function (commands) {
    const history = this.server.history;
    const command = commands[0];
    if (history.filter(id => id == command.id).length <= 0) {
        this.server.history.push(command.id);
        switch (command.type) {
            case 'frame_add_url':
                this.serverCommandsManagerFrameClear(command.id);

                const {
                    title, url
                } = JSON.parse(command.value);

                const path = require('../import/localPath');

                this.frameAddURL(path.localPath('storage/urls.json'), this.frameData(), title, url)
                    .then(() => {
                        remote.getCurrentWindow().webContents.send('add_url');
                    })
                break;
        }
    } else {
        this.defineAction('control_managerFrame_initialize', false);
    }
};

CONTROLLER.serverCommandsManagerFrameClear = function (id = '') {
    const {
        SERVERLOGINUSER,
        SERVERLOGINPASS
    } = this.serverLoginData();

    return new Promise((resolve, reject) => {
        api.post(undefined, id == '' ? `managerFrame/command/clear` : `managerFrame/command/clear/${id}`, {
                user: SERVERLOGINUSER,
                pass: SERVERLOGINPASS
            })
            .catch(err => {
                if (typeof reject === 'function') reject(err);
            })
            .then(res => {
                if (typeof resolve === 'function') resolve(res);
                CONTROLLER.defineAction('control_managerFrame_initialize', false);
            });
    });
};

/**
 * CONTROL FRAME
 */
CONTROLLER.frameEmpty = function () {
    let path = require('../import/localPath'),
        fs = require('fs');

    let file = path.localPath('storage/urls.json'),
        data = [];

    if (path.localPathExists('storage/urls.json')) {
        let read = JSON.parse(fs.readFileSync(file, 'utf-8'));

        if (read instanceof Array === true) {
            data = read;
        }
    }

    if (data instanceof Array && data.length > 0) {
        return false;
    } else {
        return true;
    }
};

CONTROLLER.frameData = function () {
    let path = require('../import/localPath'),
        fs = require('fs');

    let file = path.localPath('storage/urls.json'),
        data = [];

    if (path.localPathExists('storage/urls.json')) {
        let read = JSON.parse(fs.readFileSync(file, 'utf-8'));

        if (read instanceof Array === true) {
            data = read;
        }
    }

    return data;
};

CONTROLLER.frameAddURL = function (filepath, data, title, url) {
    this.defineAction('frame_add_url_process', true);
    return new Promise((resolve, reject) => {
        chkurl.direct(url, res => {
            if (!res) {
                if (typeof reject === 'function') reject(res);
                return ALERT.info('', `A URL "${res}" não pode ser adicionada!!!`);
            }
            /**
             * Extensions
             */
            let extension = 0;
            /**
             * D-Guard
             */
            extension = url.split('/').filter(str => {
                if (
                    str.includes('grupomave.mooo.com') &&
                    str.includes('8081')
                ) return true;
            }).length;

            if (extension > 0) {
                data.push([
                    res,
                    0,
                    'dguard',
                    title
                ]);
            } else {
                data.push([
                    res,
                    0,
                    null,
                    title
                ]);
            }
            try {
                fs.writeFileSync(filepath, Buffer.from(JSON.stringify(data), 'utf-8'), {
                    flag: 'w+'
                });
                ALERT.info('', `A URL "${res}" foi adicionada com sucesso!!!`);
                if (typeof resolve === 'function') resolve(data);
                CONTROLLER.defineAction('frame_add_url_process', false);
            } catch (err) {
                if (err) {
                    if (typeof reject === 'function') reject(res, err);
                    return console.error(err);
                }
            }
        });
    });
};

/**
 * ACTIONS
 */
CONTROLLER.defineAction = function (action, value) {
    CONTROLLER.action[action] = value
};

CONTROLLER.action = function (action) {
    return CONTROLLER.action[action];
};

module.exports = CONTROLLER;