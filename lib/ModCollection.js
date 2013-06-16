var Mod = require('./Mod');

var ModCollection = function (opts) {
    this.opts = opts;
    this.modules = {};
};

ModCollection.prototype.add = function (modName, map) {
    var mod = new Mod(map, this.opts);

    mod.modules = this.modules;
    this.modules[modName] = mod;
};

module.exports = ModCollection;