var yeoman = require('yeoman-generator');
var util = require('util');
var _ = require('lodash');
var sprintf = sprintf = require("sprintf-js").sprintf;

var Markdown = require('../../src/Markdown');

/**
 * @lends yeoman.generators.Base
 * @constructor
 */
var Generator = function (args, options) {
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
        'message': 'Add table of contents?',
        'default': self.values.toc
    }], function (values) {
        _.merge(self.values, values);
        done();
    })
};

/**
 * @param {Markdown} root
 * @returns {Markdown|null}
 * @private
 */
Generator.prototype._getTOC = function (root) {
    var head = root.firstChild();
    if (!head) {
        return null;
    }
    head.removeByID('Jump To Section');
    var toc = new Markdown('Jump To Section');
    head.prependChild(toc);
    return toc;
};

/**
 * Creates the README.md file
 */
Generator.prototype.writing = function () {
    var root = Markdown.load(this, 'README+.md');
    var head = root.firstChild();
    if (!head) {
        return;
    }

    // @todo - restrict TOC to 3 or more sections.

    if (this.values.toc) {
        head.removeByID('Jump To Section');
        var toc = new Markdown('Jump To Section');
        toc.lines = _.filter(_.map(head.child, function (/** Markdown */child) {
            return sprintf('* [%s](#%s)', child.title, child.getID());
        }));

        var backToTop = '[Back To Top](#jump-to-section)';
        _.each(head.child,function(/** Markdown */child){
            if(_.first(child.lines) !== backToTop) {
                child.lines.unshift('');
                child.lines.unshift(backToTop);
            }
        });

        head.prependChild(toc);
    }

    Markdown.save(this, 'README+.md', root);
};

Generator.prototype.end = function() {
    this.config.set(this.values);
    this.config.save();
};

module.exports = Generator;
