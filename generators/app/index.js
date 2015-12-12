var yeoman = require('yeoman-generator');
var util = require('util');

/**
 * @lends yeoman.generators.Base
 * @constructor
 */
var Generator = module.exports = function (args, options) {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
    this.values = {};
};
util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.default = function () {
    this.composeWith('readme-plus:title', {});
    this.composeWith('readme-plus:toc', {});
};
