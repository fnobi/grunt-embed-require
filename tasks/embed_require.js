module.exports = function (grunt) {
    var taskName        = 'embed_require',
        taskDescription = 'build js and embed required.',

        path = require('path'),
        _    = require('underscore'),
        ModCollection = require('../lib/ModCollection');

    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask(taskName, taskDescription, function () {
        var target = this.target,
            config = grunt.config(taskName)[target],

            // config parameters
            srcPattern = config.srcPattern || '**/*.js',
            dest = config.dest || 'js',
            src = config.src || 'src',
            namespace = config.namespace || '_embedRequire',

            mapping = grunt.file.expandMapping(srcPattern, dest, { cwd: src }),
            modCollection = new ModCollection({
                srcPath: src,
                namespace: namespace
            });

        _.each(mapping, function (map) {
            modCollection.add(map.src[0]);
        });;

        _.each(mapping, function (map) {
            var mod = modCollection.moduleForPath(path.relative(src, map.src[0]));

            console.log('[write] %s', map.dest);
            console.log(mod.requires());
            grunt.file.write(map.dest, mod.embeded());
        });
    });
};