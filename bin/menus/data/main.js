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
            this.data = JSON.parse(fs.readFileSync(file, 'utf8')) || {};
        } else {
            this.data = {
                exibition: {
                    running: true,
                    pause: false
                }
            }
            this.saveData();
        }
    }

    saveData() {
        let file = path.localPath(this.path);
        if (!path.localPathExists(this.path)) path.localPathCreate(this.path);
        fs.writeFileSync(file, JSON.stringify(this.data, null, 2));
    }

    setExibitionValue(key, value) {
        this.data.exibition[key] = value;
        this.saveData();
    }

    getExibitionValue(key) {
        return this.data.exibition[key];
    }
}

module.exports = new CACHE();