var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

var _ = requirejs('lodash');
var Markdown = requirejs('Lib/Markdown');

module.exports = function (grunt) {

    console.log('hello world');

    grunt.task.registerTask('readme', 'Generates the README.md file', function (args) {

        var defaults = {
            title: null,
            url: null,
            image: null
        };

        var options = _.merge({}, defaults, this.options() || {});

        console.log(options);

        /*
         var git = Git.getInfo();

         GitHub.getInfo().then(function (value) {
         self.values.url = value.url;
         self.values.tagLine = value.desc;
         done();
         }, function (err) {
         throw Error(err);
         });
         */

        console.log('hello');
    });
};