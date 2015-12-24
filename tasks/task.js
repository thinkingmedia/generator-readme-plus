var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + '/../src',
    nodeRequire: require
});

module.exports = function (/** IGrunt */grunt) {

    (/**
     * @param _
     * @param {Plus.Files.Logger} Logger
     * @param {Plus.ReadMe} ReadMe
     */
        function (_, Logger, ReadMe) {

        grunt.task.registerTask('readme', 'Generates the README.md file', function (args) {

            var defaults = {};
            var options = _.merge({}, defaults, this.options() || {});

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

    })(requirejs('lodash'), requirejs('Plus/Files/Logger'), requirejs('Plus/ReadMe'));
};