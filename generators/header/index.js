var yeoman = require('yeoman-generator');
var util = require('util');
var _ = require('lodash');
var chalk = require('chalk');
var sprintf = sprintf = require("sprintf-js").sprintf;

var Markdown = require('../../src/Markdown');
var Git = require('../../src/Git');

/**
 * @lends yeoman.generators.Base
 * @constructor
 */
var Generator = function (args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.git = Git.getInfo();

    this.values = this.config.getAll();
    _.merge(this.values, {
        title: this.git.repo,
        image: true,
        imageName: this.git.repo + '.png'
    });
};
util.inherits(Generator, yeoman.generators.Base);

/**
 * Configures the title for the readme.
 */
Generator.prototype.prompting = function () {
    var self = this;
    var done = this.async();
    this.prompt([{
        'type': 'input',
        'name': 'title',
        'message': 'Project Title',
        'default': self.values.title
    }, {
        'type': 'confirm',
        'name': 'image',
        'message': 'Use image: ' + chalk.yellow.bold(self.values.imageName),
        'default': self.values.image,
        'when': function () {
            return self.fs.exists(self.destinationPath(self.values.imageName));
        }
    }], function (values) {
        _.merge(self.values, values);
        done();
    });
};

Generator.prototype.settings = function () {
    var msg = {
        'Title': this.values.title,
        'Image': this.values.imageName
    };

    _.each(msg, function (value, key) {
        this.log(key + ': ' + chalk.yellow.bold(value));
    }.bind(this));

    this.config.set(this.values);
    this.config.save();
};

/**
 * Extras re-usable text from the header section. Lines from tbe bottom up that start with alpha-numeric characters.
 *
 * @param {string[]} lines
 * @returns {string[]}
 * @private
 */
Generator.prototype._getHeaderText = function (lines) {
    lines = lines.slice();
    lines.reverse();
    lines = _.takeWhile(lines, function (line) {
        return line == '' || line.match(/^[\w\d\s]/i);
    });
    lines.reverse();
    return lines;
};

/**
 * @param {Markdown} root
 * @private
 */
Generator.prototype._getHeader = function (root) {
    if (!root.firstChild()) {
        root.addChild(new Markdown(this.values.title));
    }
    return root.firstChild();
};

/**
 * Creates markdown for an image.
 * @returns {string}
 * @private
 */
Generator.prototype._getImage = function () {
    if (!this.values.image) {
        return '';
    }
    return sprintf('![%s](https://github.com/%s/%s/raw/%s/%s.png)', this.git.repo, this.git.user, this.git.repo, this.git.branch, this.git.repo);
};

Generator.prototype.writing = function () {
    var root = Markdown.load(this, 'README.md');

    var head = this._getHeader(root);
    head.title = this.values.title;
    head.lines = _.flatten([
        this._getImage(),
        this._getHeaderText(head.lines)
    ]);

    Markdown.save(this, 'README+.md', root);
};

module.exports = Generator;