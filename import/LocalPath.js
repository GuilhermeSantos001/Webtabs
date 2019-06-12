class LocalPath {
  constructor() {
    this.path = require('path');
    this.base = this.path.dirname(process.mainModule.filename);
  }
  resolve(p) {
    if (p.substring(0, 1) === '/') p = p.substring(1);
    return this.path.join(this.base, p);
  }
};

module.exports = new LocalPath();