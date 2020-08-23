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
CONTROLLER.changelog.data = {};
CONTROLLER.changelog.data['1.0.0-beta'] = {
    read: false,
    log: '1123'
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