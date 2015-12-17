var _ = require('lodash');

//var Markdown = require('../src/Markdown');
//var Git = require('../src/Git');
//var GitHub = require('../src/GitHub');

/**
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {

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