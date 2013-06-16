var Mod = require('./Mod');

var ModCollection = function () {
    this.modules = {};
};

ModCollection.prototype.add = function (modName, map) {
    var mod = new Mod(map);

    mod.modules = this.modules;
    this.modules[modName] = mod;
};

module.exports = ModCollection;