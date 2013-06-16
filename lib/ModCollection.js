var Mod = require('./Mod');

var ModCollection = function (opts) {
    this.opts = opts;
    this.modules = {};
};

ModCollection.prototype.add = function (modPath) {
    var mod = new Mod(modPath, this.opts);

    mod.modules = this.modules;
    this.modules[modPath] = mod;
};

module.exports = ModCollection;