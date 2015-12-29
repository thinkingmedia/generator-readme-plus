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
    Sections.prototype.beforeRender = function() {
        if (this.count() == 0) {
            throw Error("There are no sections to render.");
        }

        // must have a root section
        if (!this.contains('root')) {
            throw Error('Must define a root section.');
        }
    };

    /**
     * @param {string} name
     * @returns {Plus.Engine.Section}
     */
    Sections.prototype.parent = function (name) {
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
     */
    Sections.prototype.append = function (name, order, creationOrder) {

        if (this.contains(name)) {
            throw Error('Section already exists: ' + name);
        }

        Logger.debug('Sections::append %s', name);

        this.items.push(new Section(name, order, creationOrder));
    };

    return Sections;
}

module.exports = [
    'Plus/Engine/Section',
    'Plus/Files/Logger',
    Module
];