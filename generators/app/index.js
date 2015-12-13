var yeoman = require('yeoman-generator');
var util = require('util');

/**
 * @lends yeoman.generators.Base
 * @constructor
 */
var Generator = module.exports = function (args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.fs.copy(this.destinationPath('README.md'),this.destinationPath('README+.md'));
};
util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.default = function () {
    this.composeWith('readme-plus:header', {});
    this.composeWith('readme-plus:toc', []);
};
