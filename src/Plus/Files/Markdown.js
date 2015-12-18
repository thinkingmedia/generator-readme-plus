define(
    ['lodash', 'fs', 'os', 'chalk', 'Collections/LinkedList', 'Files/Logger'],
    function (_, fs, os, chalk, /** Plus.LinkedList */LinkedList, /** Plus.Logger */Logger) {

        /**
         * @name Plus.Markdown
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
         * @param {Markdown} section
         */
        Markdown.prototype.appendChild = function (section) {
            if (!(section instanceof Markdown)) {
                throw Error('Children can only be of type Markdown');
            }
            section.parent = this;
            this.child.push(section);
        };

        /**
         * @param {Markdown} section
         */
        Markdown.prototype.prependChild = function (section) {
            if (!(section instanceof Markdown)) {
                throw Error('Children can only be of type Markdown');
            }
            section.parent = this;
            this.child.unshift(section);
        };

        /**
         * @param {number} indx
         * @param {Markdown} section
         */
        Markdown.prototype.insertChild = function (indx, section) {
            if (!(section instanceof Markdown)) {
                throw Error('Children can only be of type Markdown');
            }
            section.parent = this;
            this.child.splice(indx, 0, section);
        };

        /**
         * @returns {Markdown|null}
         */
        Markdown.prototype.firstChild = function () {
            return this.child.length > 0 ? this.child[0] : null;
        };

        /**
         * @param {string} name
         * @returns {Markdown|null}
         */
        Markdown.prototype.findByID = function (name) {
            var id = _.kebabCase(name);
            return _.find(this.child, function (child) {
                    return child.getID() == id;
                }) || null;
        };

        /**
         * @param {string} name
         */
        Markdown.prototype.removeByID = function (name) {
            var item = this.findByID(name);
            if (item) {
                this.child = _.remove(this.child, item);
            }
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
            var str = this.toString();
            fs.writeFileSync(fileName, str, 'UTF8');
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
         * @name Plus.Markdown#load
         *
         * Loads a string buffer
         *
         * @param {string} fileName
         * @returns {Markdown}
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
