var dependencies = ['Q', 'lodash', 'Plus/Files/Logger', 'collections/multi-map', 'Plus/Files/Markdown'];

define(dependencies, function (Q, _, /** Plus.Files.Logger */Logger, MultiMap, /**Plus.Files.Markdown*/Markdown) {

    /**
     * @name Plus
     */

    /**
     * @name Plus.Engine
     * @constructor
     */
    var Engine = function () {
        this._filters = new MultiMap();
        this._sections = [];
    };

    /**
     * @returns {promise}
     */
    Engine.prototype.render = function () {

        if (this._sections.length == 0) {
            throw Error("There are no sections to render.");
        }

        if (this._filters.length == 0) {
            throw Error("There are no filters to render.");
        }

        // must have a root section
        if (!this.has_section('root')) {
            throw Error('Must define a root section.');
        }

        // filter each section by it's creationOrder
        var self = this;
        var promises = _.map(_.sortBy(self._sections, 'creationOrder'), function (section) {
            return self.apply_filters(section.name, section.markdown).then(function (/**Plus.Files.Markdown*/md) {
                // filter properties
                var title = self.apply_filters(section.name + ":title", md.title);
                var lines = self.apply_filters(section.name + ":lines", md.lines);
                // return a promise that resolves to a section
                return Q.spread([title, lines], function (title, lines) {
                    section.markdown = md.clone();
                    section.markdown.title = title;
                    section.markdown.lines = lines;
                    section.markdown.trim();
                    return section;
                });
            });
        });

        // promise that resolves to final Markdown object.
        return Q.all(promises).then(function (sections) {
            // append sections to their parents by their order
            _.each(_.sortBy(sections, 'order'), function (section) {
                if (section.name === 'root') {
                    return;
                }
                var parent = self._get_section_parent(section.name);
                if (parent) {
                    parent.markdown.appendChild(section.markdown);
                }
            });

            return self._get_section('root').markdown;
        });
    };

    /**
     * @param {string} name
     * @returns {boolean}
     */
    Engine.prototype.has_section = function (name) {
        return !!this._get_section(name);
    };

    /**
     * @param {string} name
     * @returns {Plus.Files.Markdown}
     * @private
     */
    Engine.prototype._get_section = function (name) {
        return _.find(this._sections, 'name', name);
    };

    /**
     * @param {string} name
     * @returns {Plus.Files.Markdown}
     * @private
     */
    Engine.prototype._get_section_parent = function (name) {
        var parts = name.split('/');
        var parentName = parts.slice(0, parts.length - 1).join('/');
        var parent = this._get_section(parentName);
        if (!parent) {
            throw Error('Parent section not found: ' + parentName);
        }
        return parent;
    };

    /**
     * Sections are first created in the order defined by the creationOrder parameter, and then appended to the
     * Markdown by the order parameter.
     *
     * @param {string} name Use forward slash to define hierarchy.
     * @param {number=} order The order is relative to parent. The default is 50.
     * @param {number=} creationOrder The default is 50
     */
    Engine.prototype.add_section = function (name, order, creationOrder) {

        if (!_.isString(name) && name !== '') {
            throw Error('Section must have a name.');
        }

        if (this.has_section(name)) {
            throw Error('Section already exists: ' + name);
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

        Logger.debug('add_section: %s', name);

        this._sections.push({
            name: name,
            order: order,
            creationOrder: creationOrder,
            markdown: new Markdown()
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
     * @param {*} value
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

    return Engine;
});