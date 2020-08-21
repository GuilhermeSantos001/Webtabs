function CONTROLLER() {
    throw new Error('This is a static class');
}

CONTROLLER.versionSystem = 'v5.31.33-build';
CONTROLLER.changelog = {
    path: 'bin/changelog/keys.json',
    files: 'bin/changelog/logs',
    logs: {},
    keys: {}
};

CONTROLLER.changelogLoadData = function () {
    let path = require('../import/localPath'),
        fs = require('fs');

    if (!fs.existsSync(path.localPath(this.changelog.path, true))) {
        CONTROLLER.changelog.keys = {
            'log1': {
                read: false,
                text: `${this.changelog.files}/text.txt`,
                title: 'UPDATE 5.6.32',
                footer: 'Postado em 18/08/2020. <br /> - Por: GuilhermeSantos001'
            }
        }

        fs.writeFileSync(this.changelog.path, JSON.stringify(CONTROLLER.changelog.keys, null, 2), 'utf8');
    } else {
        this.changelog.keys = JSON.parse(fs.readFileSync(this.changelog.path, 'utf8'));
    }
};

CONTROLLER.showChangelog = function () {
    this.changelogLoadData();

    const alert = require('../import/alert'),
        path = require('../import/localPath'),
        fs = require('fs');

    let keys = Object.assign(this.changelog.keys, {});

    Object.keys(keys).map(key => {
        const {
            read,
            text,
            title,
            footer
        } = keys[key];

        if (!read) {
            alert.info(title, fs.readFileSync(path.localPath(text, true), 'utf8'), footer, {
                active: false
            });

            readAlrady.call(this, key);
        }
    }, this);

    function readAlrady(key) {
        const path = require('../import/localPath'),
            fs = require('fs');

        let keys = Object.assign(this.changelog.keys, {});

        keys[key].read = true;

        // fs.writeFileSync(path.localPath(this.changelog.path, true), JSON.stringify(keys, null, 2), 'utf8');
    }
};

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

CONTROLLER.defineAction = function (action, value) {
    CONTROLLER[action] = value
};

CONTROLLER.action = function (action) {
    return CONTROLLER[action];
};

module.exports = CONTROLLER;