var _ = require('lodash');
var EOL = require('os').EOL;
var LinkedList = require('./LinkedList');
var yeoman = require('yeoman-generator');

/**
 * @name Markdown
 *
 * Defines a section in the readme file.
 *
 * @param {string} title
 *
 * @constructor
 */
var Markdown = function (title) {

    title = (title || '').trim();

    /**
     * The parent that owns this section.
     *
     * @type {Markdown}
     */
    this.parent = null;

    /**
     * @type {Markdown}
     */
    this.root = null;

    /**
     * URL associated with the title.
     *
     * @type {string|null}
     */
    this.url = null;

    /**
     * The contents of this section.
     *
     * @type {string[]}
     */
    this.lines = [];

    /**
     * The children of this section.
     *
     * @type {Markdown[]}
     */
    this.child = [];

    /**
     * The number of # characters prefixing the title.
     *
     * @type {number}
     */
    this.depth = (function (title) {
        for (var i = 0, c = title.length; i < c; i++) {
            if (title[i] != '#') {
                return i;
            }
        }
        return -1;
    })(title);

    /**
     * The title of the section.
     *
     * @type {string|null}
     */
    this.title = title.substr(this.depth).trim();
};

/**
 * @returns {number}
 */
Markdown.prototype.getNormalizedDepth = function () {
    return this.parent
        ? this.parent.getNormalizedDepth() + 1
        : 0;
};

/**
 * @returns {string}
 */
Markdown.prototype.getTitle = function () {
    return _.repeat('#', this.getNormalizedDepth()) + ' ' + this.title;
};

/**
 * @param {Markdown} section
 */
Markdown.prototype.addChild = function (section) {
    if (!(section instanceof Markdown)) {
        throw Error('Children can only be of type Markdown');
    }
    this.child.push(section);
};

/**
 * Removes empty lines from the start and end of the section.
 */
Markdown.prototype.trim = function () {
    var lines = this.lines;
    while (lines.length > 0 && lines[0] == '') {
        lines = _.slice(lines, 1);
    }
    while (lines.length > 0 && lines[lines.length - 1] == '') {
        lines = _.slice(lines, 0, lines.length - 1);
    }
    this.lines = lines;
};

/**
 * @returns {string}
 * @private
 */
Markdown.prototype._collapse = function () {
    this.trim();
    var lines = _.flatten([
        this.getTitle(),
        "",
        this.lines
    ]);
    return lines.join(EOL).trim();
};

/**
 * @returns {string}
 */
Markdown.prototype.toString = function () {
    var str = this._collapse().trim();
    _.each(this.child, function (child) {
        var s = child.toString().trim();
        str += EOL + EOL + s;
    });
    return str.trim();
};

/**
 * @param {string[]} lines
 * @returns {Markdown[]}
 * @private
 */
Markdown._toMarkdown = function (lines) {

    var current = new Markdown('');
    var sections = [current];
    _.each(lines, function (line) {
        if (_.startsWith(line, '#')) {
            current = new Markdown(line);
            sections.push(current);
            return;
        }
        current.lines.push(line);
    });

    _.each(sections, function (section) {
        section.trim();
    });

    return sections;
};

/**
 * @param {Markdown[]} sections
 * @returns {LinkedList<Markdown>}
 * @private
 */
Markdown._toLinkedList = function (sections) {
    var list = new LinkedList();
    _.each(sections, function (section) {
        list.push(section);
    });
    return list;
};

/**
 * @param {LinkedList.Node<Markdown>} node
 * @param {number} depth
 * @returns {Markdown}
 * @private
 */
Markdown._findParent = function (node, depth) {
    if (node.value.depth < depth) {
        return node.value;
    }
    return node.prev
        ? Markdown._findParent(node.prev, depth)
        : null;
};

/**
 * Loads a string buffer
 *
 * @param {*} gen
 * @param {string} fileName
 * @returns {Markdown}
 */
Markdown.load = function (gen, fileName) {
    var str = gen.read(gen.destinationPath(fileName));
    var lines = _.map(str.split('\n'), function (line) {
        return line.trim();
    });

    var sections = Markdown._toMarkdown(lines);
    var list = Markdown._toLinkedList(sections);

    _.each(list.toArray(), function (node) {
        var section = Markdown._findParent(node, node.value.depth);
        if (section) {
            node.value.parent = section;
            section.addChild(node.value);
        }
    });

    return list.first.value;
};

/**
 * @param {*} gen
 * @param {string} fileName
 * @param {Markdown} markDown
 */
Markdown.save = function (gen, fileName, markDown) {
    var str = markDown.toString();
    gen.fs.write(gen.destinationPath(fileName), str);
};

module.exports = Markdown;