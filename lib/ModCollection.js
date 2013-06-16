var path = require('path'),
    Mod = require('./Mod');

var ModCollection = function (opts) {
    this.opts = opts;
    this.srcPath = opts.srcPath;
    this.modules = {};
};

ModCollection.prototype.add = function (modPath) {
    var modName = path.relative(this.srcPath, modPath).replace(/\.js$/, ''),
        mod = new Mod(modName, modPath, this.opts);

    mod.collection = this;
    this.modules[modName] = mod;
};

ModCollection.prototype.moduleForName = function (modName, dirname) {
    var mod = this.modules[modName];

    if (!mod) {
        throw new Error('module "' + modName + '" is not found.');
    }

    return mod;
};

ModCollection.prototype.moduleForPath = function (modPath, dirname) {
    dirname = dirname || '.';
    var modName = path.join(dirname, modPath).replace(/\.js$/, '');
    return this.moduleForName(modName);
};


module.exports = ModCollection;