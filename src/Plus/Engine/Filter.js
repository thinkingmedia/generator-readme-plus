/**
 * @param Q
 * @param _
 * @param {Plus.Collections.Arrays} Arrays
 * @returns {Plus.Engine.Filter}
 * @ignore
 */
function Module(Q, _, Arrays) {

    /**
     * An instance of this class is created for each filter that is loaded. The responsibility of this class is to
     * manage the values that will be injected into the filter hook function. These are passed as extra pamaters to
     * the hook when the filter executes.
     *
     * @memberof Plus.Engine
     * @param {string} name
     * @param {Function|Array} filter
     * @param {number=} priority
     * @constructor
     */
    var Filter = function (name, filter, priority) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }

        filter = Arrays.toArray(filter);

        /**
         * The name of this filter.
         *
         * @type {string}
         */
        this.name = name;

        /**
         * The priority value defines the order this instance will be executed compared to other filters for the same
         * name.
         *
         * @type {number}
         */
        this.priority = ~~priority || 50;

        /**
         * This is the hook function that is executed. The first parameter is the value from the previous filter. Each
         * additional parameter is the value of a filter that was injected.
         *
         * @type {function}
         * @private
         */
        this._hook = _.last(filter);

        /**
         * These are the names of other filters to inject as extra parameters into the hook function.
         *
         * @type {Array.<string>}
         * @private
         */
        this._resolve = filter.slice(0, filter.length - 1);

        if (!_.isFunction(this._hook)) {
            throw Error('Hook parameter must be a function.');
        }
    };

    /**
     * To prevent circular references of filters. This function will throws an error if this called more than once on
     * the same instance.
     *
     * @param {Function} func
     * @private
     */
    Filter.prototype._block = function (func) {
        try {
            if (this._blocking) {
                throw Error('Filter has circular dependency.');
            }
            this._blocking = true;
            return func();
        } finally {
            this._blocking = false;
        }
    };

    /**
     * This is called by the Filters object to resolve the values that need to be injected into the hook function.
     *
     * @param {Plus.Engine.Filters} Filters
     * @returns {promise}
     */
    Filter.prototype.getResolved = function (Filters) {
        return Q.all(_.map(this._resolve, function (name) {
            return Filters.apply(name);
        }));
    };

    /**
     * Executes this filter and returns the value as a promise.
     *
     * @param {Plus.Engine.Filters} Filters
     * @param {*} value
     * @returns {promise}
     */
    Filter.prototype.getValue = function (Filters, value) {
        var self = this;
        return this._block(function () {
            return self.getResolved(Filters)
                .then(function (resolved) {
                    resolved.unshift(value);
                    return self._hook.apply(self, resolved);
                });
        });
    };

    return Filter;
}

module.exports = [
    'q',
    'lodash',
    'Plus/Collections/Arrays',
    Module
];