/**
 * @param _
 * @param chalk
 * @param {Plus.Services.Print} print
 * @returns {Plus.Files.Logger}
 * @constructor
 * @ignore
 */
function Module(_, chalk, print) {

    /**
     * An injectable logging class that allows the code to write output using the logging method of the parent
     * application.
     *
     * For example, when using ReadMe with Grunt this class is configured to use the Grunt logging functions.
     *
     * @memberof Plus.Files
     * @constructor
     */
    var Logger = function () {
        this.config({});
    };

    /**
     * Configure how this logger writes messages.
     *
     * @param {{color:boolean,info:function,debug:function,error:function}} options
     */
    Logger.prototype.config = function (options) {
        var defaults = {
            color: true,
            info: function (str) {
                console.log(str);
            },
            debug: function (str) {
                console.log(str);
            },
            error: function (str) {
                console.error(str);
            }
        };
        this.options = _.merge({}, defaults, options);
    };

    /**
     * @param {Array} values
     * @returns {string}
     * @private
     */
    Logger.prototype._format = function (values) {
        if (!this.options.color) {
            return print.apply(this, values);
        }
        var args = _.flatten([values[0], _.map(_.slice(values, 1), function (arg) {
            return chalk.yellow.bold(arg);
        })]);
        return print.apply(this, args);
    };

    /**
     * Writes out logging messages.
     */
    Logger.prototype.info = function () {
        this.options.info(this._format(arguments));
    };

    /**
     * Writes out debug messages.
     */
    Logger.prototype.debug = function () {
        this.options.debug(this._format(arguments));
    };

    /**
     * Writes out an error message.
     */
    Logger.prototype.error = function () {
        this.options.error(this._format(arguments));
    };

    return new Logger();
}

module.exports = [
    'lodash',
    'chalk',
    'Plus/Services/Print',
    Module
];