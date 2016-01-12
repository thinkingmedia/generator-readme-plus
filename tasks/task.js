var _ = require('lodash');

/**
 * @type {Plus.Loader}
 */
var loader = new (require('../src/Plus/Loader'))();

/**
 * @type {Plus.Files.Logger}
 */
var Logger = loader.resolve('Plus/Files/Logger');

/**
 * @param {IGrunt} grunt
 */
function Module(grunt) {

    Logger.config({
        info: function (str) {
            grunt.log.ok(str);
        },
        debug: function (str) {
            grunt.log.debug(str);
        },
        error: function (str) {
            grunt.log.error(str);
        }
    });
    loader.attach(Logger);

    grunt.task.registerTask('readme', 'Generates the README.md file', function () {

        /**
         * @type {Plus.ReadMe}
         */
        var ReadMe = loader.resolve('Plus/ReadMe');

        var defaults = {};
        var options = _.merge({}, defaults, this.options() || {});

        var config = grunt.config('readme') || {};

        var done = this.async();
        var readme = new ReadMe("README.md", options);
        readme.render(config.dest || "README.md").then(function (updated) {
            grunt.log.ok('Done');
            done();
        }, function (err) {
            grunt.fail.fatal(err);
            done();
        });
    });
}

module.exports = Module;