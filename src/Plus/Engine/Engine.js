/**
 * @param Q
 * @param _
 * @param Print
 * @param {Plus.Files.Logger} Logger
 * @param MultiMap
 * @param {Plus.Collections.Arrays} Arrays
 * @param {Plus.Engine.Sections} Sections
 *
 * @returns {Plus.Engine}
 */
function Module(Q, _, Print, Logger, MultiMap, Arrays, Sections) {

    /**
     * @name Plus.Engine
     *
     * @constructor
     */
    var Engine = function () {
        this._filters = new MultiMap();
        this._sections = new Sections();
    };

    /**
     * @returns {promise}
     */
    Engine.prototype.render = function () {

        if (this._sections.count() == 0) {
            throw Error("There are no sections to render.");
        }

        if (this._filters.length == 0) {
            throw Error("There are no filters to render.");
        }

        // must have a root section
        if (!this._sections.contains('root')) {
            throw Error('Must define a root section.');
        }

        // filter each section by it's creationOrder
        var self = this;
        var promises = _.map(this._sections.byCreationOrder(), function (/** Plus.Engine.Section*/section) {
            return self.apply_filters(section.name, section.markdown).then(function (/**Plus.Files.Markdown*/md) {
                // filter properties
                var title = self.apply_filters(section.name + ":title", md.title);
                var lines = self.apply_filters(section.name + ":lines", md.lines);
                // return a promise that resolves to a section
                return Q.spread([title, lines], function (title, lines) {
                    section.markdown = md.clone();
                    section.markdown.title = title.trim();
                    section.markdown.lines = Arrays.trim(lines);
                    return section;
                });
            });
        });

        // catches some common bugs during development
        if (_.filter(promises).length != self._sections.count()) {
            throw Error('Incorrect number of section promises.');
        }

        // promise that resolves to final Markdown object.
        return Q.all(promises).then(function (items) {
            var sections = new Sections(items);
            if (sections.count() != self._sections.count()) {
                throw Error('Incorrect number of sections.');
            }
            // append sections to their parents by their order
            _.each(sections.byOrder(), function (/** Plus.Engine.Section*/section) {
                if (section.name === 'root') {
                    return;
                }
                var parent = sections.parent(section.name);
                if (parent) {
                    parent.markdown.appendChild(section.markdown);
                }
            });

            return sections.find('root').markdown;
        });
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
    Engine.prototype.add_filter = function (name, hook, priority) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }

        priority = ~~priority || 50;
        Logger.debug('add_filter: %s %s', name, priority);

        if (!_.isFunction(hook)) {
            throw Error('Hook parameter must be a function.');
        }

        this._filters.get(name).add({
            name: name,
            hook: hook,
            priority: priority
        });
    };

    /**
     * @param {string} name
     * @param {*=} value
     * @returns {promise}
     */
    Engine.prototype.apply_filters = function (name, value) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }

        Logger.debug('apply_filter: %s', name);

        var promise = Q(value);
        _.each(_.sortBy(this._filters.get(name) || [], 'priority'), function (filter) {
            promise = promise.then(function (value) {
                return filter.hook(value);
            });
        });
        return promise;
    };

    /**
     * @param {string|string[]} names
     * @param {function} callback
     */
    Engine.prototype.get_values = function (names, callback) {
        if (!_.isArray(names)) {
            return this.get_values([names], callback);
        }
        var self = this;
        var promises = _.map(names, function (name) {
            return self.apply_filters(name);
        });
        Q.all(promises, function (values) {
            callback.call(self, values);
        });
    };

    /**
     * @param {string|string[]} files
     */
    Engine.prototype.load_filters = function (files) {
        if (!_.isArray(files)) {
            return this.load_filters([files]);
        }
        var self = this;
        _.each(files, function (file) {
            var filter = require(file);
            if (_.isFunction(filter)) {
                filter(this);
            }
            if (_.isArray(filter)) {
                var name = filter[0];
                if (!_.isString(name) || name === '') {
                    throw Error(Print("%s first array value should be string."));
                }
                var func = filter[1];
                if (!_.isFunction(func)) {
                    throw Error(Print("%s second array value should be function."));
                }
                self.add_filter(name, func, filter[2]);
            }
        });
    };

    return Engine;
}

module.exports = [
    'Q',
    'lodash',
    'Plus/Services/Print',
    'Plus/Files/Logger',
    'collections/multi-map',
    'Plus/Collections/Arrays',
    'Plus/Engine/Sections',
    Module
];
