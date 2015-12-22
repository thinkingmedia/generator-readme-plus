var dependencies = ['lodash', 'Plus/Files/Logger', 'collections/multi-map', 'Plus/Files/Markdown'];

define(dependencies, function (_, /** Plus.Files.Logger */Logger, MultiMap, /**Plus.Files.Markdown*/Markdown) {

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
     * @returns {Plus.Files.Markdown}
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
        var sections = _.sortBy(this._sections, 'creationOrder');
        _.each(sections, function (section) {
            /**
             * @type {Plus.Files.Markdown}
             */
            section.markdown = this.apply_filters(section.name, section.markdown);
            section.markdown.trim();
            section.markdown.title = this.apply_filters(section.name + ":title", section.markdown.title);
            section.markdown.lines = this.apply_filters(section.name + ":lines", section.markdown.lines);
        }.bind(this));

        // append sections to their parents by their order
        sections = _.sortBy(sections, 'order');
        _.each(sections, function (section) {
            if (section.name === 'root') {
                return;
            }
            var parent = this._get_section_parent(section.name);
            if (parent) {
                parent.markdown.appendChild(section.markdown);
            }
        }.bind(this));

        // return the root section
        return this._get_section('root').markdown;
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

        this._filters.get(name).add({hook: hook, priority: priority});
    };

    /**
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    Engine.prototype.apply_filters = function (name, value) {
        if (!_.isString(name) && name !== '') {
            throw Error('Filter must have a name.');
        }

        Logger.debug('apply_filter: %s', name);

        var filters = this._filters.get(name);
        if (!filters) {
            return value;
        }

        _.each(_.sortBy(filters, 'priority'), function (filter) {
            value = filter.hook(value);
        });

        return value;
    };

    return Engine;
});