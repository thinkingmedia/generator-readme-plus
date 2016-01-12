/**
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul')
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
        readme: {
            options: {},
            src: [
                'src/**/*.js'
            ],
            dest: 'README+.md'
        },
        jsdoc: {
            build: {
                options: {
                    destination: 'doc',
                    template: "node_modules/jaguarjs-jsdoc",
                    configure: "node_modules/jaguarjs-jsdoc/conf.json"
                },
                src: [
                    'src/**/*.js'
                ]
            }
        },
        open: {
            docs: {
                path: 'doc/index.html'
            },
            coverage: {
                path: 'coverage/lcov-report/index.html'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'test/bootstrap.js'
                },
                src: [
                    'test/**/*.test.js'
                ]
            }
        },
        mocha_istanbul: {
            coverage: {
                options: {
                    require: 'test/bootstrap.js'
                },
                src: [
                    'test/**/*.test.js'
                ]
            }
        }
    });

    grunt.task.registerTask('test', ['mochaTest:test']);
    grunt.task.registerTask('doc', ['jsdoc', 'open:docs']);
    grunt.task.registerTask('docs', ['doc']);
    grunt.task.registerTask('coverage', ['mocha_istanbul:coverage']);
    grunt.task.registerTask('coverage:open', ['mocha_istanbul:coverage', 'open:coverage']);
    grunt.task.registerTask('build', ['test', 'doc']);
    grunt.task.registerTask('default', ['build']);
};