class LZString {
    constructor() {
        this.base = require('lz-string');
    }
    compressToBase64(string = '') {
        return this.base.compressToBase64(string);
    }
    decompressFromBase64(string = '') {
        return this.base.decompressFromBase64(string);
    }
}

module.exports = new LZString();