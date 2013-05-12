module.exports = function (grunt) {
    var taskName        = 'embed_require',
        taskDescription = 'build js and embed required.',

        path = require('path'),
        _    = require('underscore'),
        Mod  = require('../lib/Mod');

    grunt.file.defaultEncoding = 'utf8';

    grunt.registerMultiTask(taskName, taskDescription, function () {
        var target  = this.target,
            config  = grunt.config(taskName)[target],
            mapping = grunt.file.expandMapping(config.files, config.dest, { cwd: config.src }),
            mods    = {};

        _.each(mapping, function (map) {
            mods[path.resolve(map.src[0])] = new Mod(map, mods);
        });;

        _.each(mods, function (mod) {
            mod.writeToDest();
        });;
    });
};