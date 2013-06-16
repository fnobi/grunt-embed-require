module.exports = function (grunt) {
    var taskName        = 'embed_require',
        taskDescription = 'build js and embed required.',

        path = require('path'),
        _    = require('underscore'),
        Mod  = require('../lib/Mod');

    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask(taskName, taskDescription, function () {
        var target = this.target,
            config = grunt.config(taskName)[target],
            srcPattern = config.srcPattern || '**/*.js',
            dest = config.dest || 'js',
            src = config.src || 'src',
            mapping = grunt.file.expandMapping(srcPattern, dest, { cwd: src }),
            mods = {};

        _.each(mapping, function (map) {
            mods[path.resolve(map.src[0])] = new Mod(map, mods);
        });;

        _.each(mods, function (mod) {
            mod.writeToDest();
        });;
    });
};