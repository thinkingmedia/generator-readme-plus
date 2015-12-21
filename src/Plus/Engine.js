var dependencies = ['lodash', 'Plus/Files/Logger', 'collections/multi-map'];

define(dependencies, function (_, /** Plus.Files.Logger */Logger, MultiMap) {

    /**
     * @name Plus
     */

    /**
     * @name Plus.Engine
     * @constructor
     */
    var Engine = function () {
        this._filters = new MultiMap();
        this._actions = new MultiMap();
    };

    /**
     * @param {Plus.Files.Markdown} md
     */
    Engine.prototype.render = function (md) {
        this.trigger('before-render');
        this.trigger('render');
        this.trigger('post-render');
    };

    /**
     * @param {string} name
     * @param {function} hook
     * @param {number} priority
     */
    Engine.prototype.add_section = function (name, hook, priority) {
        Logger.debug('add_section: %s', name);
        this._actions.get(name).add({hook: hook, priority: priority});
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
     * @param {number} priority
     */
    Engine.prototype.add_filter = function (name, hook, priority) {
        Logger.debug('add_filter: %s', name);
        this._filters.get(name).add({hook: hook, priority: priority});
    };

    /**
     *
     * @param {string} name
     * @param {*} value
     *
     * @returns {*}
     *
     * @todo can not call trigger inside apply_filer
     */
    Engine.prototype.apply_filters = function (name, value) {
        Logger.debug('apply_filter: %s', name);
    };

    /**
     * @param {string} name
     *
     * @todo an action can only be triggered once (use a list to keep track).
     * @todo use a queue to run only one trigger at a time.
     */
    Engine.prototype.trigger = function (name) {
        Logger.debug('trigger: %s', name);
    };

    return new Engine();
});