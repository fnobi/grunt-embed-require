grunt-embed-require
===================

build js and embed required.

## example

```javascript
// Gruntfile.js

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        embed_require: {
            dev: {
                src: 'src/js',
                dest: 'js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-embed-require');

    grunt.registerTask('build', ['embed_require:dev']);

    grunt.registerTask('default', ['build']);
};
```

```javascript
// src/js/main.js

var MyModule = require('MyModule'),
    $ = require('lib/jquery');

$(function () {
    new MyModule('hoge');
});
```

```javascript
// src/js/MyModule.js

var MyModule = function (name) {
    this.name = name;
};

MyModule.prototype.hello = function () {
    return this.name;
};

module.exports = MyModule;
```
