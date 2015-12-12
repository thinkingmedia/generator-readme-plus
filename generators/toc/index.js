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
        toc: true
    };
};
util.inherits(Generator, yeoman.generators.Base);

/**
 * Configure table of contents
 */
Generator.prototype.prompting = function () {
    var self = this;
    var done = this.async();
    this.prompt([{
        'type': 'confirm',
        'name': 'toc',
        'message': 'Add table of content?',
        'default': self.values.toc
    }], function (values) {
        _.merge(self.values, values);
        done();
    })
};

/**
 * Creates the README.md file
 */
Generator.prototype.writing = function () {
    //var readme = this.fs.read(this.destinationPath('README.md'));
    //console.log(readme);
    //console.log(this.values);
};