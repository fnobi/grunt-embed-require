var fs   = require('fs'),
    path = require('path'),
    ejs  = require('ejs'),
    _    = require('underscore'),

    scriptTemplate  = fs.readFileSync(__dirname + '/../templates/script.js.ejs', 'utf8'),
    wrapperTemplate = fs.readFileSync(__dirname + '/../templates/wrapper.js.ejs', 'utf8');

var Mod = function (map) {
    var srcPath = map.src[0],
        destPath = map.dest;

    this.modules = {};

    this.srcPath  = srcPath;
    this.destPath = destPath;
};

Mod.prototype.content = function () {
    if (this.scriptCache) {
        return this.scriptCache;
    }

    return this.scriptCache = fs.readFileSync(this.srcPath, 'utf8');
};

Mod.prototype.script = function () {
    var content = this.content();

    return ejs.render(scriptTemplate, {
        script: content,
        modName: this.srcPath.replace(/\.js$/, ''),
        cwd: path.dirname(this.srcPath)
    });
};

Mod.prototype.requires = function () {
    if (this.requiresCache) {
        return this.requiresCache;
    }

    var pattern      = 'require\\( *[\'\"]([\\w/]+)[\'\"] *\\)',
        mods         = [],

        requireCalls = this.content().match(new RegExp(pattern, 'g'));

    if (!requireCalls) {
        return mods;
    }

    _.each(requireCalls, function (requireCall) {
        var modName = requireCall.match(new RegExp(pattern))[1],
            mod = this.mod(modName);
        if (!mod) {
            throw new Error('module "' + modName + '" is not found.');
        }
        mods = _.union(mod.requires(), [modName], mods);
    }.bind(this));

    return this.requiresCache = _.uniq(mods);
};

Mod.prototype.embeded = function () {
    var scripts = [];

    var requires = this.requires();

    requires.forEach(function (modName) {
        scripts.push(this.mod(modName).script());
    }.bind(this));

    scripts.push(this.script());

    return this.embededCache = ejs.render(wrapperTemplate, {
        mods: scripts.join('\n\n')
    });
};

Mod.prototype.mod = function (modName) {
    var modPath = path.resolve(path.dirname(this.srcPath), modName) + '.js';
    return this.modules[modPath];
};

module.exports = Mod;