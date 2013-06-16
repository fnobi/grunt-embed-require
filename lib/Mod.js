var fs   = require('fs'),
    path = require('path'),
    ejs  = require('ejs'),
    _    = require('underscore'),

    scriptTemplate  = fs.readFileSync(__dirname + '/../templates/script.js.ejs', 'utf8'),
    wrapperTemplate = fs.readFileSync(__dirname + '/../templates/wrapper.js.ejs', 'utf8');

var Mod = function (modName, modPath, opts) {
    this.modName = modName;
    this.modPath = modPath;
    this.dirname = path.relative(
        opts.srcPath,
        path.dirname(this.modPath).replace(/\/$/, '')
    ) || '.';

    this.namespace = opts.namespace;
};

Mod.prototype.content = function () {
    if (this.scriptCache) {
        return this.scriptCache;
    }

    return this.scriptCache = fs.readFileSync(this.modPath, 'utf8');
};

Mod.prototype.script = function () {
    var content = this.content();

    return ejs.render(scriptTemplate, {
        script: content,
        modName: this.modName,
        dirname: this.dirname,
        namespace: this.namespace
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
            mod = this.collection.moduleForName(modName, this.dirname);

        mods = _.union(mod.requires(), [modName], mods);
    }.bind(this));

    return this.requiresCache = _.uniq(mods);
};

Mod.prototype.embeded = function () {
    var scripts = [];

    var requires = this.requires();

    requires.forEach(function (modName) {
        scripts.push(this.collection.moduleForName(modName, this.dirname).script());
    }.bind(this));

    scripts.push(this.script());

    return this.embededCache = ejs.render(wrapperTemplate, {
        mods: scripts.join('\n\n'),
        namespace: this.namespace
    });
};

module.exports = Mod;