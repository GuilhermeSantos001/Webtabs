/**
 * Import
 */
const [
    path,
    fs
] = [
    require('../../import/localPath'),
    require('fs')
];

class CACHE {
    constructor() {
        this.path = 'storage/menus/cache.json';
        this.data = {};
        this.initialize();
    }

    initialize() {
        let file = path.localPath(this.path);
        if (!path.localPathExists(this.path)) path.localPathCreate(this.path);
        if (fs.existsSync(file)) {
            this.data = JSON.parse(fs.readFileSync(file, 'utf-8')) || {};
        } else {
            this.data = {
                exibition: {
                    running: true,
                    pause: false
                },
                developertoolsmode: {
                    show_debug_messages: true,
                    start_frame: true,
                    append_frames: true,
                    remove_frames: true,
                    tick_frames: true,
                    pause_frames: true,
                    errors_system: true
                },
                changelog: {
                    show: true
                },
                controllerOnline: {
                    activated: true
                }
            }
            this.saveData();
        }
    }

    saveData() {
        let file = path.localPath(this.path);
        if (!path.localPathExists(this.path)) path.localPathCreate(this.path);
        fs.writeFileSync(file, Buffer.from(JSON.stringify(this.data), 'utf-8'), {flag: 'w+'});
    }

    setExibitionValue(key, value) {
        this.data.exibition[key] = value;
        this.saveData();
    }

    getExibitionValue(key) {
        return this.data.exibition[key];
    }

    setDeveloperToolsModeValue(key, value) {
        this.data.developertoolsmode[key] = value;
        this.saveData();
    }

    getDeveloperToolsModeValue(key) {
        return this.data.developertoolsmode[key];
    }

    setChangelogValue(key, value) {
        this.data.changelog[key] = value;
        this.saveData();
    }

    getChangelogValue(key) {
        return this.data.changelog[key];
    }

    setControllerOnlineValue(key, value) {
        this.data.controllerOnline[key] = value;
        this.saveData();
    }

    getControllerOnlineValue(key) {
        return this.data.controllerOnline[key];
    }
}

module.exports = new CACHE();