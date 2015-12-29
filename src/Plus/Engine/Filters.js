/**
 * @param Q
 * @param _
 * @param {Plus.Files.Logger} Logger
 * @param {Plus.Engine.Filter} Filter
 * @param MultiMap
 *
 * @returns {Plus.Engine.Filters}
 */
function Module(Q, _, Logger, Filter, MultiMap) {

    /**
     * @name Plus.Engine.Filters
     * @constructor
     */
    var Filters = function () {
        this.items = new MultiMap();
    };

    /**
     * @returns {number}
     */
    Filters.prototype.count = function () {
        return this.items.length;
    };

    /**
     * Validate this collection
     */
    Filters.prototype.beforeRender = function () {
        if (this.count() == 0) {
            throw Error("There are no filters to render.");
        }
    };

    /**
     * @readme filters."Add Filter"
     *
     * Hook a function to a specific filter action. ReadMe offers filters to allow Writers to modify various types
     * of data at writing time.
     *
     * A writer can modify data by binding a callback to a filter hook. When the filter is later applied, each bound
     * callback is run in order of priority, and given the opportunity to modify a value by returning a new value.
     *
     * @param {string} name
     * @param {function} hook
     * @param {number=} priority
     */
    Filters.prototype.add = function (name, hook, priority) {

        Logger.debug('Filters::add %s %s', name, priority);

        this.items.get(name).add(new Filter(name, hook, priority));
    };

    /**
     * @param {string} name
     * @param {*=} value
     * @returns {promise}
     */
    Filters.prototype.apply = function (name, value) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }

        Logger.debug('Filters::apply %s', name);

        var promise = Q(value);
        _.each(_.sortBy(this.items.get(name) || [], 'priority'), function (filter) {
            promise = promise.then(function (value) {
                return filter.hook(value);
            });
        });
        return promise;
    };

    /**
     * @param {string|string[]} names
     * @param {Function} callback
     */
    Filters.prototype.get_values = function (names, callback) {
        if (!_.isArray(names)) {
            return this.get_values([names], callback);
        }
        var promises = _.map(names, function (name) {
            return this.apply(name);
        }.bind(this));
        Q.all(promises, function (values) {
            callback.call(this, values);
        }.bind(this));
    };

    /**
     * @param {string|string[]} files
     */
    Filters.prototype.load = function (files) {
        if (!_.isArray(files)) {
            return this.load([files]);
        }
        _.each(files, function (file) {
            var filter = require(file);
            if (_.isFunction(filter)) {
                filter(this);
            }
            if (_.isArray(filter)) {
                var name = filter[0];
                if (!_.isString(name) || name === '') {
                    throw Error("First array value should be string.");
                }
                var func = filter[1];
                if (!_.isFunction(func)) {
                    throw Error("Second array value should be function.");
                }
                this.add(name, func, filter[2]);
            }
        }.bind(this));
    };

    return Filters;
}

module.exports = [
    'Q',
    'lodash',
    'Plus/Files/Logger',
    'Plus/Engine/Filter',
    'collections/multi-map',
    Module
];