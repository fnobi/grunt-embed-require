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
                namespace: namespace
            });

        _.each(mapping, function (map) {
            modCollection.add(path.resolve(map.src[0]), map);
        });;

        _.each(modCollection.modules, function (mod) {
            console.log('[write] %s', mod.destPath);
            grunt.file.write(mod.destPath, mod.embeded());
        });;
    });
};