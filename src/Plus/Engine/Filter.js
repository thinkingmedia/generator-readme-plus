/**
 * @param Q
 * @param _
 * @param {Plus.Collections.Arrays} Arrays
 *
 * @returns {Plus.Engine.Filter}
 */
function Module(Q, _, Arrays) {

    /**
     * @name Plus.Engine.Filter
     *
     * @param {string} name
     * @param {Function|Array} filter
     * @param {number=} priority
     *
     * @constructor
     */
    var Filter = function (name, filter, priority) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }

        filter = Arrays.toArray(filter);

        this.name = name;
        this.priority = ~~priority || 50;

        this._hook = _.last(filter);
        this._resolve = filter.slice(0, filter.length - 1);

        if (!_.isFunction(this._hook)) {
            throw Error('Hook parameter must be a function.');
        }
    };

    /**
     * Throws an error if this function is called more than once on the same filter instance.
     *
     * @param {Function} func
     */
    Filter.prototype.block = function (func) {
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
     * @param {Plus.Engine.Filters} Filters
     *
     * @returns {Promise<Array>}
     */
    Filter.prototype.getResolved = function (Filters) {
        return Q.all(_.map(this._resolve, function (name) {
            return Filters.apply(name);
        }));
    };

    /**
     * @todo this could be cached.
     *
     * @param {Plus.Engine.Filters} Filters
     * @param {*} value
     * @returns {Promise}
     */
    Filter.prototype.getValue = function (Filters, value) {
        var self = this;
        return this.block(function () {
            return self.getResolved(Filters).then(function (resolved) {
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