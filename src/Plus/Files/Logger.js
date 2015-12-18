define(['lodash'], function (_) {

    /**
     * @constructor
     */
    var Logger = function () {
        this.config({});
    };

    /**
     * @param options
     */
    Logger.prototype.config = function (options) {
        var defaults = {
            info: function(str) {
                console.log(str);
            },
            debug: function(str) {
                console.log(str);
            },
            error: function(str) {
                console.error(str);
            }
        };
        this.options = _.merge({}, defaults, options);
    };

    /**
     * @param {string} msg
     */
    Logger.prototype.info = function (msg) {
        this.options.info(msg);
    };

    /**
     * @param {string} msg
     */
    Logger.prototype.debug = function (msg) {
        this.options.debug(msg);
    };

    /**
     * @param {string} msg
     */
    Logger.prototype.error = function (msg) {
        this.options.error(msg);
    };

    return new Logger();
});