/**
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {

    if (grunt.file.exists('../grunt-thinkingmedia/tasks')) {
        grunt.loadTasks('../grunt-thinkingmedia/tasks');
    } else {
        grunt.loadNpmTasks('grunt-thinkingmedia');
    }

    // old dependencies
    //
    // "dustjs-linkedin": "~2.6.0",
    // "fileset": "^0.1.5",
    // "github": "^0.2.3",
    // "lodash": "~3.0.0",
    // "optjs": "^3.2.1-boom",
    // "q": "~1.2.0",
    // "regex-cache": "~0.3.0",
    // "shelljs": "^0.3.0",
    // "sprintf-js": "^1.0.2",
    // "winston": "^0.9.0",
    // "yeoman-generator": "^0.21.1"

    // old dev dependencies
    //
    // "codeclimate-test-reporter": "0.0.4",
    // "expect.js": "^0.3.1",
    // "istanbul": "^0.3.8",
    // "mocha": "^2.2.1",
    // "mocha-istanbul": "^0.2.0"

    grunt.loadTasks('tasks');

    grunt.initConfig({
        config: {
            webroot: false,
            src: [
                './src'
            ]
        },
        readme: {
            options: {},
            src: [
                'src/**/*.js'
            ],
            dest: 'README+.md'
        }
    });
};