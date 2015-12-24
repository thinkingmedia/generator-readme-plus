var dependencies = ['lodash'];

define(dependencies, function (_) {

    /**
     * @name Plus.Plugin
     * @constructor
     */
    var Plugin = function () {

    };

    /**
     * @param {Object} plugin
     */
    Plugin.prototype.extend = function (plugin) {

        function Base() {

        }

        Base.prototype = _.create(plugin.prototype, {
            'constructor': Base
        });

        return Base;
    };

    Plugin.extend = function (other) {
        Plugin.prototype = _.create(other.prototype, {
            'constructor': Plugin
        });
        return Plugin;
    }

    return new Plugin();
});