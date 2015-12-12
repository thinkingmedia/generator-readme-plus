var yeoman = require('yeoman-generator');
var util = require('util');
var _ = require('lodash');

/**
 * @lends yeoman.generators.Base
 * @constructor
 */
var Generator = module.exports = function (args, options) {
    yeoman.generators.Base.apply(this, arguments);
    this.values = {
        autoTitle: true,
        title: this.determineAppname()
    };
};
util.inherits(Generator, yeoman.generators.Base);

/**
 * Configures the title for the readme.
 */
Generator.prototype.prompting = function () {
    var self = this;
    var done = this.async();
    this.prompt([{
        'type': 'confirm',
        'name': 'autoTitle',
        'message': 'Use repository name as title?',
        'default': self.values.autoTitle
    }, {
        'type': 'input',
        'name': 'title',
        'message': 'Project Title',
        'default': self.values.title,
        when: function (values) {
            return !values.autoTitle;
        }
    }], function (values) {
        _.merge(self.values, values);
        done();
    });
};

/**
 * Creates the README.md file
 */
Generator.prototype.writing = function () {
    //var readme = this.fs.read(this.destinationPath('README.md'));
    //console.log(readme);
    //console.log(this.values);
};