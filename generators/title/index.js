var yeoman = require('yeoman-generator');
var util = require('util');
var _ = require('lodash');
var Markdown = require('../../src/Markdown');

/**
 * @lends yeoman.generators.Base
 * @constructor
 */
var Generator = function (args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.option('auto', {
        'desc': 'Accept the defaults or previously save settings for all inputs.',
        'alias': 'a'
    });

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
    if (this.options.auto) {
        return;
    }
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

Generator.prototype.settings = function () {
    this.log('Title: ' + this.values.title);
    this.config.set(this.values);
    this.config.save();
};

Generator.prototype.writing = function () {
    var root = Markdown.load(this, 'README.md');
    Markdown.save(this, 'README+.md', root);
};

module.exports = Generator;