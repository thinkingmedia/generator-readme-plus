define(['lodash','Files/Logger'], function (_,/** Plus.Logger */Logger) {

    /**
     * @name Plus
     */

    /**
     * @name Plus.Engine
     * @constructor
     */
    var Engine = function () {
        this._filters = [];
        this._actions = [];
    };

    /**
     * @param {Plus.Markdown} md
     */
    Engine.prototype.render = function (md) {
        this.trigger('before-render');
    };

    /**
     * @param {string} name
     * @param {function} hook
     * @param {number} priority
     */
    Engine.prototype.add_action = function (name, hook, priority) {
        this._actions.push({
            name: name,
            hook: hook,
            priority: priority
        });
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
     * @param {number} priority
     */
    Engine.prototype.add_filter = function (name, hook, priority) {
        this._filters.push({
            name: name,
            hook: hook,
            priority: priority
        });
    };

    /**
     *
     * @param {string} name
     * @param {*} value
     *
     * @returns {*}
     */
    Engine.prototype.apply_filters = function (name, value) {

    };

    /**
     * @param {string} name
     */
    Engine.prototype.trigger= function(name) {
    };

    return new Engine();
});