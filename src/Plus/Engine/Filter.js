/**
 * @returns {Plus.Engine.Filter}
 */
function Module() {


    /**
     * @name Plus.Engine.Filter
     *
     * @param {string} name
     * @param {Function} hook
     * @param {number=} priority
     *
     * @constructor
     */
    var Filter = function (name, hook, priority) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }
        if (!_.isFunction(hook)) {
            throw Error('Hook parameter must be a function.');
        }

        this.name = name;
        this.hook = hook;
        this.priority = ~~priority || 50;
    };

    return Filter;
}

module.exports = [
    Module
];