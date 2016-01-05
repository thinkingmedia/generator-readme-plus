/**
 * @param {Plus.Engine.Section} Section
 * @param {Plus.Files.Logger} Logger
 *
 * @returns {Plus.Engine.Sections}
 */
function Module(Section, Logger) {

    /**
     * @name Plus.Engine.Sections
     *
     * @param {Plus.Engine.Section[]=} items
     *
     * @property {Plus.Engine.Section[]} items
     *
     * @constructor
     */
    var Sections = function (items) {
        if (items && !_.isArray(items)) {
            throw Error('invalid argument');
        }
        this.items = (items || []).slice();
    };

    /**
     * @returns {Number}
     */
    Sections.prototype.count = function () {
        return this.items.length;
    };

    /**
     * Validate this collection
     */
    Sections.prototype.beforeRender = function () {
        if (this.count() == 0) {
            throw Error("There are no sections to render.");
        }

        if (!this.contains('root')) {
            throw Error('Must define a root section.');
        }
    };

    /**
     * @param {string} name
     * @returns {Plus.Engine.Section}
     */
    Sections.prototype.parent = function (name) {
        if (!name || !_.isString(name)) {
            throw Error('invalid argument');
        }
        var parts = name.split('/');
        var parentName = parts.slice(0, parts.length - 1).join('/');
        var parent = this.find(parentName);
        if (!parent) {
            throw Error('Parent section not found: ' + parentName);
        }
        return parent;
    };

    /**
     * @param {string} name
     * @returns {Plus.Engine.Section}
     */
    Sections.prototype.find = function (name) {
        return _.find(this.items, 'name', name);
    };

    /**
     * @param {string} name
     * @returns {boolean}
     */
    Sections.prototype.contains = function (name) {
        return !!this.find(name);
    };

    /**
     * Returns the sections sorted by their creation order.
     *
     * @returns {Plus.Engine.Section[]}
     */
    Sections.prototype.byCreationOrder = function () {
        return _.sortBy(this.items, 'creationOrder');
    };

    /**
     * Returns the sections sorted by their order.
     *
     * @returns {Plus.Engine.Section[]}
     */
    Sections.prototype.byOrder = function () {
        return _.sortBy(this.items, 'order');
    };

    /**
     * Sections are first created in the order defined by the creationOrder parameter, and then appended to the
     * Markdown by the order parameter.
     *
     * @param {string} name Use forward slash to define hierarchy.
     * @param {number=} order The order is relative to parent. The default is 50.
     * @param {number=} creationOrder The default is 50
     *
     * @returns {Plus.Engine.Section}
     */
    Sections.prototype.append = function (name, order, creationOrder) {

        if (this.contains(name)) {
            throw Error('Section already exists: ' + name);
        }

        Logger.debug('Sections::append %s', name);

        var section = new Section(name, order, creationOrder);
        this.items.push(section);
        return section;
    };

    /**
     * @todo this should create the main Markdown without having to append to Markdown objects owned by sections.
     *
     * @returns {Plus.Files.Markdown}
     */
    Sections.prototype.getMarkdown = function () {
        if (!this.contains('root')) {
            throw Error('Sections do not have a root.');
        }

        // append sections to their parents by their order
        _.each(this.byOrder(), function (/** Plus.Engine.Section*/section) {
            if (section.name === 'root') {
                return;
            }
            var parent = this.parent(section.name);
            if (parent) {
                parent.markdown.appendChild(section.markdown);
            } else {
                throw Error('Section missing parent');
            }
        }.bind(this));

        return this.find('root').markdown;
    };

    return Sections;
}

module.exports = [
    'Plus/Engine/Section',
    'Plus/Files/Logger',
    Module
];