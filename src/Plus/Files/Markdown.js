var dependencies = ['lodash', 'fs', 'os', 'chalk', 'Plus/Collections/LinkedList', 'Plus/Files/Logger'];

define(dependencies, function (_, fs, os, chalk, /** Plus.Collections.LinkedList */LinkedList, /** Plus.Files.Logger */Logger) {

    /**
     * @name Plus.Files.Markdown
     *
     * Defines a section in the readme file.
     *
     * @param {string=} title
     *
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
     * @param {Plus.Files.Markdown=} parent
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.clone = function (parent) {
        var md = new Markdown(this.title);
        md.parent = parent || null;
        md.lines = this.lines.slice();
        md.child = _.map(this.child, function (c) {
            return c.clone(md);
        });
        return md;
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
     * @param {number} indx
     * @param {Plus.Files.Markdown} section
     * @returns {Plus.Files.Markdown}
     */
    Markdown.prototype.insertChild = function (indx, section) {
        if (!(section instanceof Markdown)) {
            throw Error('Children can only be of type Markdown');
        }
        section.parent = this;
        this.child.splice(indx, 0, section);
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
            this.child = _.remove(this.child, item);
        }
        return this;
    };

    /**
     * Removes empty lines from the start and end of the section.
     * @returns {Plus.Files.Markdown}
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
        return this;
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
        return lines.join(os.EOL).trim();
    };

    /**
     * @returns {string}
     */
    Markdown.prototype.toString = function () {
        var str = this._collapse().trim();
        _.each(this.child, function (child) {
            var s = child.toString().trim();
            str += os.EOL + os.EOL + s;
        });
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
});
