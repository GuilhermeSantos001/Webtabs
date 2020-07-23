function CONTROLLER() {
    throw new Error('This is a static class');
}

CONTROLLER.frameEmpty = function () {
    let path = require('../import/localPath'),
        fs = require('fs');

    let file = path.localPath('storage/urls.json'),
        data = [];

    if (path.localPathExists('storage/urls.json')) {
        let read = JSON.parse(fs.readFileSync(file, {
            encoding: 'utf8'
        }));

        if (data instanceof Array === true) {
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

CONTROLLER.action = function(action) {
   return CONTROLLER[action];
}

module.exports = CONTROLLER;