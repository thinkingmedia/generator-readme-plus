define(['path', 'Files/Markdown', 'Files/Logger'], function (path, /** Markdown */Markdown, /** Logger */Logger) {

    /**
     * @name Plus
     *
     * @param {Markdown} md
     * @constructor
     */
    var Plus = function (md) {
        if (!(md instanceof Markdown)) {
            throw Error('Parameter must be a Markdown object.');
        }

        this.filters = [];
        this.actions = [];
    };

    /**
     * @param {string} name
     * @param {function} hook
     * @param {number} priority
     */
    Plus.prototype.add_action = function (name, hook, priority) {
        this.actions.push({
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
    Plus.prototype.add_filter = function (name, hook, priority) {
        this.filters.push({
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
    Plus.prototype.apply_filters = function (name, value) {

    };

    return Plus;
});