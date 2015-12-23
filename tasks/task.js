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

            var defaults = {
                title: null,
                url: null,
                image: null
            };
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

            var done = this.async();
            var readme = new ReadMe("README.md");
            readme.render("README+.md").then(function(updated){
                if(updated) {
                    grunt.log.ok('README updated');
                } else {
                    grunt.log.ok('Not updated');
                }
                done();
            },function(err){
                grunt.fail.fatal(err);
                done();
            });
        });

    })(requirejs('lodash'), requirejs('Plus/Files/Logger'), requirejs('Plus/ReadMe'));
};