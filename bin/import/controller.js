function CONTROLLER() {
    throw new Error('This is a static class');
}

CONTROLLER.versionSystem = 'v5.31.33-build';
CONTROLLER.changelog = {};

/**
 * CHANGELOG v1.0
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
            registry = JSON.parse(fs.readFileSync(pathFileData, 'utf8'));
        } catch (error) {
            return console.log(error);
        }
    }

    registry[CONTROLLER.versionSystem] = false;
    fs.writeFileSync(pathFileData, JSON.stringify(registry, null, 2));
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
            registry = JSON.parse(fs.readFileSync(pathFileData, 'utf8'));
        } catch (error) {
            return console.log(error);
        }
    }

    const axios = require('axios');
    axios.get('https://raw.githubusercontent.com/GuilhermeSantos001/updates_files/master/WebTabs/changelog/changelog.json')
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
        const ALERT = require('../import/alert');
        axios.get(url)
            .then(function (response) {
                const {
                    data
                } = response;

                ALERT.info(title, data, `Lançado em ${date}.`, {
                    active: false
                }).then(() => {
                    registry[CONTROLLER.versionSystem] = true;
                    fs.writeFileSync(pathFileData, JSON.stringify(registry, null, 2));
                });
            })
            .catch(function () {});
    }
};

/**
 * CONTROL FRAME v1.0
 */
CONTROLLER.frameEmpty = function () {
    let path = require('../import/localPath'),
        fs = require('fs');

    let file = path.localPath('storage/urls.json'),
        data = [];

    if (path.localPathExists('storage/urls.json')) {
        let read = JSON.parse(fs.readFileSync(file, {
            encoding: 'utf8'
        }));

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

/**
 * ACTIONS v1.0
 */
CONTROLLER.defineAction = function (action, value) {
    CONTROLLER[action] = value
};

CONTROLLER.action = function (action) {
    return CONTROLLER[action];
};

module.exports = CONTROLLER;