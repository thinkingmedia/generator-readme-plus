/**
 * @param _
 * @param fs
 * @param os
 * @param {Plus.Collections.LinkedList} LinkedList
 * @param {Plus.Files.Logger} Logger
 * @param {Plus.Collections.Arrays} Arrays
 * @returns {Plus.Files.Markdown}
 * @ignore
 */
function Module(_, fs, os, LinkedList, Logger, Arrays) {

    /**
     *
     * Defines a section in the readme file.
     *
     * @memberof Plus.Files
     * @param {string=} title
     * @constructor
     */
    var Markdown = function (title) {

        title = (title || '').trim();

        /**
         * The parent that owns this section.
         *
         * @type {Plus.Files.Markdown}
         */
        this.parent = null;

        /**
         * This is only used during serializing from disk.
         *
         * @type {Plus.Files.Markdown}
         */
        this.root = null;

        /**
         * The contents of this section.
         *
         * @type {string[]}
         */
        this.lines = [];

        /**
         * The children of this section.
         *
         * @type {Plus.Files.Markdown[]}
         * @todo Rename to children
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
            return 0;
        })(title);

        /**
         * The title of the section.
         *
         * @type {string|null}
         */
        this.title = title.substr(this.depth).trim();
    };

    /**
     * @param {Plus.Files.Markdown=} parent
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.deepCopy = function (parent) {
        var md = new Markdown(this.title);
        md.parent = parent || null;
        md.lines = this.lines.slice();
        md.child = _.map(this.child, function (c) {
            return c.deepCopy(md);
        });
        return md;
    };

    /**
     * @param {Plus.Files.Markdown=} parent
     * @returns {Plus.Files.Markdown}
     * @deprecated
     */
    Markdown.prototype.clone = function (parent) {
        console.error('Markdown::clone is deprecated use deepCopy instead');
        return this.deepCopy(parent);
    };

    /**
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.dropChildren = function () {
        this.child = [];
        return this;
    };

    /**
     * @returns {string}
     */
    Markdown.prototype.getID = function () {
        return _.kebabCase(this.title);
    };

    /**
     * Returns the depth of this child in the tree. This is based upon the number of parents and not how many
     * hash tags were in the original title.
     *
     * @returns {number}
     * @see Plus.Files.Markdown#depth
     */
    Markdown.prototype.getNormalizedDepth = function () {
        return this.parent
            ? this.parent.getNormalizedDepth() + 1
            : 0;
    };

    /**
     * Returns the title as Markdown heading using the normalized depth as the sub-heading value.
     *
     * @returns {string}
     */
    Markdown.prototype.getTitle = function () {
        var str = this.title.trim();
        return str
            ? '#' + _.repeat('#', this.getNormalizedDepth()) + str
            : '';
    };

    /**
     * @param {Plus.Files.Markdown} section
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.appendChild = function (section) {
        if (!(section instanceof Markdown)) {
            throw Error('Children can only be of type Markdown');
        }
        section.parent = this;
        this.child.push(section);
        return this;
    };

    /**
     * @param {Plus.Files.Markdown} section
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.prependChild = function (section) {
        if (!(section instanceof Markdown)) {
            throw Error('Children can only be of type Markdown');
        }
        section.parent = this;
        this.child.unshift(section);
        return this;
    };

    /**
     * @returns {Plus.Files.Markdown|null}
     */
    Markdown.prototype.firstChild = function () {
        return this.child.length > 0 ? this.child[0] : null;
    };

    /**
     * @param {string} name
     * @returns {Plus.Files.Markdown|null}
     */
    Markdown.prototype.findByID = function (name) {
        var id = _.kebabCase(name);
        return _.find(this.child, function (child) {
                return child.getID() == id;
            }) || null;
    };

    /**
     * @param {string} name
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.removeByID = function (name) {
        var item = this.findByID(name);
        if (item) {
            _.remove(this.child, item);
        }
        return this;
    };

    /**
     * Removes empty lines from the start and end of the section.
     *
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.trim = function () {
        this.lines = Arrays.trim(this.lines);
        return this;
    };

    /**
     * @returns {string}
     * @private
     */
    Markdown.prototype._collapse = function () {
        var lines = Arrays.trim(this.lines);
        lines.unshift('');
        lines.unshift(this.getTitle());
        return Arrays.toString(lines);
    };

    /**
     * @returns {string}
     */
    Markdown.prototype.toString = function () {
        var str = this._collapse();
        str += _.map(this.child, function (child) {
            return '\n\n'+child.toString().trim();
        }).join('');
        return str.trim();
    };

    /**
     * @param {string} fileName
     */
    Markdown.prototype.save = function (fileName) {
        if (!fileName) {
            throw Error("Must provide a filename");
        }
        Logger.info('Writing: %s', fileName);
        var str = this.toString();
        fs.writeFileSync(fileName, str, 'UTF8');
    };

    /**
     * @param {string[]} lines
     * @returns {Plus.Files.Markdown[]}
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
     * @param {Plus.Files.Markdown[]} sections
     * @returns {LinkedList<Plus.Files.Markdown>}
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
     * @param {LinkedList.Node<Plus.Files.Markdown>} node
     * @param {number} depth
     * @returns {Plus.Files.Markdown}
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
     * @name Plus.Files.Markdown#load
     *
     * Loads a string buffer
     *
     * @param {string} fileName
     * @returns {Plus.Files.Markdown}
     */
    Markdown.load = function (fileName) {

        Logger.info('Reading: %s', fileName);

        var str = fs.readFileSync(fileName, 'UTF8');
        var lines = _.map(str.split('\n'), function (line) {
            return line.trim();
        });

        var sections = Markdown._toMarkdown(lines);
        var list = Markdown._toLinkedList(sections);

        _.each(list.toArray(), function (node) {
            var section = Markdown._findParent(node, node.value.depth);
            if (section) {
                node.value.parent = section;
                section.appendChild(node.value);
            }
        });

        return list.first.value;
    };

    return Markdown;
}

module.exports = [
    'lodash',
    'fs',
    'os',
    'Plus/Collections/LinkedList',
    'Plus/Files/Logger',
    'Plus/Collections/Arrays',
    Module
];
