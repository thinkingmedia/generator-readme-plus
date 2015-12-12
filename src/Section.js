var _ = require('lodash');
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
     * The title of the section.
     *
     * @type {string|null}
     */
    this.title = (title || '').trim();

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
    })(this.title);

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
 * Changes the title
 *
 * @param {string} str
 */
Section.prototype.setTitle = function (str) {
    this.title = str;
};

/**
 * @param {Section} section
 */
Section.prototype.addChild = function(section) {
    if(!(section instanceof Section)) {
        throw Error('Children can only be of type Section');
    }
    this.child.push(section);
};

/**
 * @param {string[]} lines
 * @returns {Section[]}
 * @private
 */
Section._toSections = function (lines) {

    var current = new Section('README.md');
    var sections = [current];
    _.each(lines, function (line) {
        if (_.startsWith(line, '#')) {
            current = new Section(line);
            sections.push(current);
            return;
        }
        current.lines.push(line);
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
            section.addChild(node.value);
        }
    });

    return list.first.value;
};

module.exports = Section;