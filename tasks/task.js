var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src/Plus',
    nodeRequire: require
});

var _ = requirejs('lodash');

/**
 * @type {Plus.Markdown}
 */
var Markdown = requirejs('Files/Markdown');

/**
 * @type {Plus.ReadMe}
 */
var ReadMe = requirejs('ReadMe');

/**
 * @type {Logger}
 */
var Logger = requirejs('Files/Logger');

module.exports = function (grunt) {

    grunt.task.registerTask('readme', 'Generates the README.md file', function (args) {

        var defaults = {
            title: null,
            url: null,
            image: null
        };
        var options = _.merge({}, defaults, this.options() || {});

        Logger.config({
            info: function(str) {
                grunt.log.ok(str);
            },
            debug: function(str) {
                grunt.log.debug(str);
            },
            error: function(str) {
                grunt.log.error(str);
            }
        });

        var md = Markdown.load("README.md");
        ReadMe.render(md);

        //md.save("./README+.md");
    });
};