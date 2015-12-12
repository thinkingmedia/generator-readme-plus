var yeoman = require('yeoman-generator');
var util = require('util');
var git = require('./lib/git');
var _ = require('lodash');
var chalk = require('chalk');

/**
 * @constructor
 * @type {module.ReadMePlus}
 */
var ReadMePlus = module.exports = function (args, options) {
    yeoman.generators.Base.apply(this, arguments);
    // @todo use yeoman file
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
    this.values = {
        autoTitle: true,
        title: 'Hello World',
        toc: true
    };
};

util.inherits(ReadMePlus, yeoman.generators.Base);

/**
 * Configures the title for the readme.
 */
ReadMePlus.prototype.askTitle = function () {
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
 * Configure table of contents
 */
ReadMePlus.prototype.askTableOfContents = function () {
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
ReadMePlus.prototype.writing = function () {
    var readme = this.fs.read(this.destinationPath('README.md'));
    console.log(readme);
    console.log(this.values);
};