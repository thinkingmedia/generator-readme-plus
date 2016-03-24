/**
 * @param Q
 * @param _
 * @param {Plus.Files.Logger} Logger
 * @param {Plus.Engine.Filter} Filter
 * @param MultiMap
 * @param {Plus.Engine.Section} Section
 * @param {Plus.Collections.Arrays} Arrays
 * @returns {Plus.Engine.Filters}
 * @ignore
 */
function Module(Q, _, Logger, Filter, MultiMap, Section, Arrays) {

    /**
     * @memberof Plus.Engine
     *
     * @constructor
     */
    var Filters = function () {
        this.items = new MultiMap();
    };

    /**
     * Returns the number of filters registered.
     *
     * @returns {number}
     */
    Filters.prototype.count = function () {
        return this.items.length;
    };

    /**
     * Called before the Engine performs a render. Verifies that there are filters in this container.
     */
    Filters.prototype.beforeRender = function () {
        if (this.count() == 0) {
            throw Error("There are no filters to render.");
        }
    };

    /**
     * Checks if a filter has been registered.
     *
     * @param {string} name
     * @returns {boolean}
     */
    Filters.prototype.contains = function (name) {
        if (!_.isString(name) && name !== '') {
            throw Error('invalid argument');
        }
        return this.items.has(name);
    };

    /**
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
        if(!_.isString(name) || name === '') {
            throw Error('invalid name');
        }

        Logger.debug('Filters::add %s %s', name, priority);

        this.items.get(name).add(new Filter(name, hook, priority));
    };

    /**
     * Sorts the collection of filters by their priority.
     *
     * @param {string} name
     * @returns {Plus.Engine.Filter[]}
     */
    Filters.prototype.byPriority = function (name) {
        if (!_.isString(name) && name !== '') {
            throw Error('invalid argument');
        }
        return _.orderBy(this.items.get(name) || [], 'priority', ['desc']);
    };

    /**
     * Executes a filter and returns a promise that resolves to the final value.
     *
     * @param {string} name
     * @param {*=} value
     * @returns {promise}
     */
    Filters.prototype.apply = function (name, value) {
        if (!_.isString(name) && name !== '') {
            throw Error('invalid argument');
        }

        Logger.debug('Filters::apply %s', name);

        if (typeof value === 'undefined' && !this.contains(name)) {
            throw Error('Filters does not contain ' + name);
        }

        var self = this;
        var promise = Q(value);
        _.each(this.byPriority(name), function (/** Plus.Engine.Filter */filter) {
            promise = promise.then(function (value) {
                return filter.getValue(self, value);
            });
        });
        return promise;
    };

    /**
     * Resolves all the filters in the array.
     *
     * @param {string[]|string} names
     * @returns {Promise[]}
     */
    Filters.prototype.promises = function (names) {

        names = _.isArray(names) ? names : [names];

        return _.map(names, function (name) {
            return this.contains(name)
                ? this.apply(name)
                : Q(undefined);
        }.bind(this));
    };

    /**
     * Used to inject the values of filters into a function as arguments.
     *
     * @param {string|string[]} names
     * @param {Function} callback
     * @returns {Promise}
     */
    Filters.prototype.resolve = function (names, callback) {

        var promises = this.promises(names);

        return Q.all(promises)
            .then(function (values) {
                return callback.apply(this, values);
            }.bind(this));
    };

    /**
     * @param {string} name
     * @returns {string}
     * @private
     */
    Filters.prototype._get_id = function (name) {
        return _.kebabCase(_.last(name.split('/'))).replace(/-/g, ':');
    };

    /**
     * Loads all the filters using the loader.
     *
     * @param {Plus.Loader} loader
     */
    Filters.prototype.load = function (loader) {
        var names = loader.resolve("Plus/filters.json");
        if (!_.isArray(names)) {
            throw Error('Unexpected data from filters.json');
        }
        _.each(names, function (name) {
            var func = loader.resolve(name);
            if (!_.isFunction(func)) {
                throw Error('Filter module should return a filter function.');
            }
            this.add(this._get_id(name), func);
        }.bind(this));
    };

    /**
     * @todo Markdown should be created and attached to sections.
     *
     * @param {Plus.Engine.Section} section
     * @returns {Promise<Plus.Engine.Section>}
     */
    Filters.prototype.render = function (section) {
        if (!section || !(section instanceof Section)) {
            throw Error('invalid argument');
        }

        var self = this;
        return self.apply(section.name, section.markdown).then(function (/**Plus.Files.Markdown*/md) {
            // filter properties
            var title = self.apply(section.name + ":title", md.title);
            var lines = self.apply(section.name + ":lines", md.lines);
            // return a promise that resolves to a section
            return Q.spread([title, lines], function (title, lines) {
                section.markdown = md.deepCopy();
                section.markdown.title = title.trim();
                section.markdown.lines = Arrays.trim(lines);
                return section;
            });
        });
    };

    return Filters;
}

module.exports = [
    'q',
    'lodash',
    'Plus/Files/Logger',
    'Plus/Engine/Filter',
    'collections/multi-map',
    'Plus/Engine/Section',
    'Plus/Collections/Arrays',
    Module
];