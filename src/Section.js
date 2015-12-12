var _ = require('lodash');
var EOL = require('os').EOL;
var LinkedList = require('./LinkedList');

/**
 * @name Section
 *
 * Defines a section in the readme file.
 *
 * @param {string} title
 *
 * @constructor
 */
var Section = function (title) {

    title = (title || '').trim();

    /**
     * The parent that owns this section.
     *
     * @type {Section}
     */
    this.parent = null;

    /**
     * @type {Section}
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
     * @type {Section[]}
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
Section.prototype.getNormalizedDepth = function () {
    return this.parent
        ? this.parent.getNormalizedDepth() + 1
        : 0;
};

/**
 * @returns {string}
 */
Section.prototype.getTitle = function () {
    return _.repeat('#', this.getNormalizedDepth()) + ' ' + this.title;
};

/**
 * @param {Section} section
 */
Section.prototype.addChild = function (section) {
    if (!(section instanceof Section)) {
        throw Error('Children can only be of type Section');
    }
    this.child.push(section);
};

/**
 * Removes empty lines from the start and end of the section.
 */
Section.prototype.trim = function () {
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
Section.prototype._collapse = function() {
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
Section.prototype.toString = function () {
    var str = this._collapse().trim();
    _.each(this.child,function(child){
        var s = child.toString().trim();
        str += EOL + EOL + s;
    });
    return str.trim();
};

/**
 * @param {string[]} lines
 * @returns {Section[]}
 * @private
 */
Section._toSections = function (lines) {

    var current = new Section('');
    var sections = [current];
    _.each(lines, function (line) {
        if (_.startsWith(line, '#')) {
            current = new Section(line);
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
 * @param {Section[]} sections
 * @returns {LinkedList<Section>}
 * @private
 */
Section._toLinkedList = function (sections) {
    var list = new LinkedList();
    _.each(sections, function (section) {
        list.push(section);
    });
    return list;
};

/**
 * @param {LinkedList.Node<Section>} node
 * @param {number} depth
 * @returns {Section}
 * @private
 */
Section._findParent = function (node, depth) {
    if (node.value.depth < depth) {
        return node.value;
    }
    return node.prev
        ? Section._findParent(node.prev, depth)
        : null;
};

/**
 * Loads a string buffer
 *
 * @param {string} str
 * @returns {Section}
 */
Section.load = function (str) {
    var lines = _.map(str.split('\n'), function (line) {
        return line.trim();
    });

    var sections = Section._toSections(lines);
    var list = Section._toLinkedList(sections);

    _.each(list.toArray(), function (node) {
        var section = Section._findParent(node, node.value.depth);
        if (section) {
            node.value.parent = section;
            section.addChild(node.value);
        }
    });

    return list.first.value;
};

module.exports = Section;