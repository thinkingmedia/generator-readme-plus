/**
 * @param {Plus.Files.Markdown} Markdown
 *
 * @returns {Plus.Engine.Section}
 */
function Module(Markdown) {

    /**
     * @name Plus.Engine.Section
     *
     * Sections are used to pre-define the structure of the Markdown document. These objects define both the
     * tree hierarchy and creation order for each section.
     *
     * @param {string} name
     * @param {number=} order
     * @param {number=} creationOrder
     *
     * @constructor
     */
    var Section = function(name, order, creationOrder) {

        if (!_.isString(name) && name !== '') {
            throw Error('Section must have a name.');
        }

        if (name !== 'root') {
            if (name.split('/').length == 1) {
                throw Error('Only the root is allowed to be top-level: ' + name);
            }
            if (!_.startsWith(name, 'root/')) {
                throw Error('Must be a child of the root: ' + name);
            }
        }

        order = order || 50;
        creationOrder = creationOrder || 50;

        if (!_.isNumber(order)
            || !_.isNumber(creationOrder)
            || order <= 0
            || order > 100
            || creationOrder <= 0
            || creationOrder > 100) {
            throw Error("Sort order parameters must be numeric with a value between 1 and 100.");
        }

        this.name = name;
        this.order = order;
        this.creationOrder = creationOrder;
        /**
         * @type {Plus.Files.Markdown}
         */
        this.markdown = new Markdown();
    };

    Section.prototype.update = function() {

    };

    return Section;

}

module.exports = [
    'Plus/Files/Markdown',
    Module
];